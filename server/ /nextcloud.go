package main

import (
	"bytes"
	b64 "encoding/base64"
	json "encoding/json"
	xml "encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type AccessRequestStruct struct {
	Login string `json:"login"`
	Poll  struct {
		Token    string `json:"token"`
		Endpoint string `json:"endpoint"`
	} `json:"poll"`
}
type PolResultStruct struct {
	Server      string `json:"server"`
	LoginName   string `json:"loginName"`
	AppPassword string `json:"appPassword"`
}

type RequestStruct struct {
	BaseUrl string `json:"baseUrl"`
	Folder  string `json:"folder"`
	File    string `json:"file"`
	Url     string `json:"url"`
	Auth    string `json:"auth"`
	Data    string `json:"data"`
}

type PropfindResponse struct {
	XMLName       xml.Name `xml:"multistatus"`
	CreationDate  string   `xml:"response>propstat>prop>creationdate"`
	DisplayName   string   `xml:"response>propstat>prop>displayname"`
	ETag          string   `xml:"response>propstat>prop>getetag"`
	LastModified  string   `xml:"response>propstat>prop>getlastmodified"`
	ResourceType  string   `xml:"response>propstat>prop>resourcetype>collection,omitempty"`
	ContentLength int64    `xml:"response>propstat>prop>getcontentlength,omitempty"`
	ContentType   string   `xml:"response>propstat>prop>getcontenttype,omitempty"`
}

/*
<D:propfind xmlns:D="DAV:">
  <D:prop>
    <D:getlastmodified/>
    <D:getetag/>
    <D:getcontenttype/>
    <D:getcontentlength/>
  </D:prop>
</D:propfind>
*/

func NextCloud() {
	router := mux.NewRouter()
	router.HandleFunc("/nextcloud/RequestAccess", RequestAccess).Methods("POST")
	router.HandleFunc("/nextcloud/Poll", Poll).Methods("POST")
	//router.HandleFunc("/nextcloud/GetFolderContent", GetFolderContent).Methods("GET")
	router.HandleFunc("/nextcloud/GetFile", GetFile).Methods("POST")
	router.HandleFunc("/nextcloud/DeleteFile", DeleteFile).Methods("POST")

	//router.HandleFunc("/nextcloud/CreateFolder", CreateFolder).Methods("POST")
	router.HandleFunc("/nextcloud/SaveFile", SaveFile).Methods("POST")
	http.ListenAndServe(":8000", handlers.CORS(
		handlers.AllowedOrigins([]string{"bullhoff.com", "http://bullhoff.com", "https://bullhoff.com", "http://www.bullhoff.com", "https://www.bullhoff.com"}),
		handlers.AllowedMethods([]string{"GET", "PUT", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		//AllowCredentials: true,
	)(router))
}
func normalizeURL(inputURL string) string {
	u, err := url.Parse(inputURL)
	if err != nil {
		fmt.Println(err)
	}
	u.Path = "/" + strings.Trim(u.Path, "/")
	return u.String()
}
func getBody(req *http.Request) string {
	body, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	return string(body)
}

func RequestAccess(w http.ResponseWriter, req *http.Request) {
	/*
		REQUEST ACCESS
		POST https://vera.se.tab.digital/index.php/login/v2
		"poll": {
			"token": "nsHOXAJICXTU5bt2MDqN9QjwwCj5h1l80FBcixMOn6IHfTEINealOReX2gB9WG3Ckw4q4flfz8gqq0zqoKVkRiSBCWqUyxYtVMioYSoS3KO5gM3EYC6swgfYkgRkm1bS",
			"endpoint": "https://vera.se.tab.digital/login/v2/poll"
		},
		"login": "https://vera.se.tab.digital/login/v2/flow/N2Gw7RmHMSZ2Jm2A0thPYtTLyYbbJeiE1bwarQb4GjZnvppT8ZGl4GExy6RwGQ1LmODwJRc3qN3cSHd1ugt85EZMkLI41YuJdX4ufeTcuP3ecwKNbJ4X3ajOEwH8RpY0"
	*/
	url := getBody(req)
	url = normalizeURL(url)
	client := &http.Client{}

	req, _ = http.NewRequest("POST", string(url), nil)
	req.Header.Set("User-Agent", "Bullhoff.com")
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	//body := getBody(resp.Body)
	body, _ := io.ReadAll(resp.Body)
	pollObj := AccessRequestStruct{}
	//JsonUnmarshal(body, &pollObj)
	JsonUnmarshal(string(body), &pollObj)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(Stringify(pollObj)))
}

func Poll(w http.ResponseWriter, req *http.Request) {
	/*
		POLL RESPONSE
		POST https://vera.se.tab.digital/login/v2/poll
		"server": "https://vera.se.tab.digital",
		"loginName": "email@address.com",
		"appPassword": "XXXXXXXXXXXXXXXXXXXXXXX"
	*/
	w.Header().Set("Connection", "keep-alive")
	body := getBody(req)
	pollObj := AccessRequestStruct{}
	JsonUnmarshal(string(body), &pollObj)
	url := pollObj.Poll.Endpoint + "?token=" + pollObj.Poll.Token
	url = normalizeURL(url)

	timeout := 120 * time.Second
	interval := 5 * time.Second
	ticks := 0 * time.Second

	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	for range ticker.C {
		ticks++
		res, err := http.Post(url, "application/json", bytes.NewBuffer([]byte{}))
		if err != nil {
			fmt.Println(err)
			continue
		}
		if interval*ticks > timeout {
			fmt.Println("timeout", ticks, interval, timeout)
			w.WriteHeader(http.StatusNotFound)
			break
		}

		if res.StatusCode == http.StatusOK {
			body, err := io.ReadAll(res.Body)
			if err != nil {
				fmt.Println(err)
				return
			}
			pollRes := PolResultStruct{}
			JsonUnmarshal(string(body), &pollRes)
			fmt.Println(pollRes)
			auth := "basic " + b64.StdEncoding.EncodeToString([]byte(pollRes.LoginName+":"+pollRes.AppPassword))
			obj := map[string]interface{}{"User": pollRes.LoginName, "Token": auth}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(Stringify(obj)))
			break
		} else {
			fmt.Println("Polling...", interval*ticks)
		}
	}
}
func GetFile(w http.ResponseWriter, req *http.Request) {
	body := getBody(req)
	request := RequestStruct{}
	JsonUnmarshal(body, &request)
	body2 := getFileContent(request)
	if body2 == "" {
		w.WriteHeader(404)
		w.Write([]byte("File not found"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(body2))
}
func getFileContent(request RequestStruct) string {
	fileStatus := CheckPathExists(request)
	if fileStatus == http.StatusNotFound {
		return "" // "File not found"
	}
	url := normalizeURL(request.BaseUrl + "/" + request.Folder + "/" + request.File)

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(url), nil)
	req.Header.Set("Authorization", request.Auth)
	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	return string(body)
}
func SaveFile(w http.ResponseWriter, req *http.Request) {
	body := getBody(req)
	request := RequestStruct{}
	JsonUnmarshal(body, &request)
	fileStatus := CheckPathExists(request)
	if fileStatus == http.StatusNotFound {
		createFolders(request)
	} /* else {
		currentContentStr := getFileContent(request)
		merged, errMerge := mergeJSON(currentContentStr, request.Data)
		fmt.Println("mergeJSON", errMerge, merged)
		if errMerge == nil {
			request.Data = merged
		}
	} */
	url := normalizeURL(request.BaseUrl + "/" + request.Folder + "/" + request.File)
	client := &http.Client{}

	data := request.Data

	req2, _ := http.NewRequest("PUT", string(url), bytes.NewBuffer([]byte(data)))
	req2.Header.Set("Authorization", request.Auth)
	resp, err := client.Do(req2)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte("Failed to save"))
		return
	}
	defer resp.Body.Close()

	body2, _ := io.ReadAll(resp.Body)

	fmt.Println(string(body2))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(body2))
}

func DeleteFile(w http.ResponseWriter, req *http.Request) {
	fmt.Println("DeleteFile")
	body := getBody(req)
	request := RequestStruct{}
	JsonUnmarshal(body, &request)
	fileStatus := CheckPathExists(request)
	if fileStatus == http.StatusNotFound {
		w.WriteHeader(fileStatus)
		w.Write([]byte("File not found"))
		return
	}
	url := normalizeURL(request.BaseUrl + "/" + request.Folder + "/" + request.File)
	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte("Failed to delete"))
		return
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte("Failed to delete"))
		return
	}
	defer resp.Body.Close()

	w.WriteHeader(resp.StatusCode)
}

func CheckPathExists(request RequestStruct) int {
	url := normalizeURL(request.BaseUrl + "/" + request.Folder + "/" + request.File)
	client := &http.Client{}
	req, err := http.NewRequest("PROPFIND", url, nil)
	if err != nil {
		fmt.Println(err)
	}
	req.Header.Set("Authorization", request.Auth) //req.SetBasicAuth("user", "password")
	req.Header.Set("Content-Type", "application/xml")
	req.Header.Set("Depth", "0")
	resp, err2 := client.Do(req)
	if err2 != nil {
		fmt.Println(err2)
	}
	defer resp.Body.Close()
	var propfindResponse PropfindResponse
	err2 = xml.NewDecoder(resp.Body).Decode(&propfindResponse)
	if err2 != nil {
		fmt.Println(err2)
	}
	return resp.StatusCode

}
func createFolders(request RequestStruct) {
	folders := strings.Split(request.Folder+"/"+request.File, "/")
	fmt.Println("folders:", folders)
	for i := 1; i < len(folders)-1; i++ {
		folderPath := strings.Join(folders[:i+1], "/")
		fmt.Println("folderPath:", i, folderPath)
		if folderPath != "" {
			createFolder(request, folderPath)
		}
	}
	fmt.Println("File does not exist, missing folders created.")
}
func createFolder(request RequestStruct, folderPath string) {
	// Create the MKCOL request
	req, err := http.NewRequest("MKCOL", normalizeURL(request.BaseUrl+"/"+folderPath), nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	req.Header.Set("Authorization", request.Auth)
	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("resp.StatusCode:", resp.StatusCode)
	// Check the response status code
	if resp.StatusCode == http.StatusCreated {
		fmt.Println("Folder created:", folderPath)
	} else if resp.StatusCode == http.StatusConflict {
		fmt.Println("Folder already exists:", folderPath)
	} else {
		fmt.Println("Unexpected response:", resp.Status)
	}
}

func Stringify[T any](devices T) string {
	res, err := json.Marshal(devices)
	if err == nil {
		return string(res)
	} else {
		return "{}"
	}
}
func StringifyIndent[T any](devices T) string {
	res, err := json.MarshalIndent(devices, "", "\t")
	if err == nil {
		return string(res)
	} else {
		return "{}"
	}
}

func XmlUnmarshal[T any](v T, data string) {
	err := xml.Unmarshal([]byte(data), &v)
	if err != nil {
		fmt.Printf("error: %v", err)
	}
}
func JsonUnmarshal[T any](data string, v T) {
	err := json.Unmarshal([]byte(data), &v)
	if err != nil {
		fmt.Printf("error: %v", err)
	}
}

/*
func mergeJSON(json1, json2 string) (string, error) {
	// Unmarshal the JSON strings into maps
	var m1, m2 map[string]interface{}
	err := json.Unmarshal([]byte(json1), &m1)
	if err != nil {
		return "", err
	}
	err = json.Unmarshal([]byte(json2), &m2)
	if err != nil {
		return "", err
	}
	// Merge the maps recursively
	mergedMap := mergeMaps(m1, m2)

	// Marshal the merged map into a JSON string
	mergedJSON, err := json.Marshal(mergedMap)
	if err != nil {
		return "", err
	}

	return string(mergedJSON), nil
}

func mergeMaps(m1, m2 map[string]interface{}) map[string]interface{} {
	mergedMap := make(map[string]interface{})

	// Copy all keys and values from m1 to mergedMap
	for k, v := range m1 {
		mergedMap[k] = v
	}

	// Merge all keys and values from m2 to mergedMap
	for k, v2 := range m2 {
		v1, ok := mergedMap[k]
		if !ok {
			// If the key doesn't exist in m1, add it to mergedMap
			mergedMap[k] = v2
		} else {
			// If the key exists in both m1 and m2, merge the values recursively
			switch v2.(type) {
			case map[string]interface{}:
				// If the value is a map, merge the maps recursively
				v1Map, ok := v1.(map[string]interface{})
				if !ok {
					// If the value in m1 is not a map, overwrite it with the value from m2
					mergedMap[k] = v2
				} else {
					mergedMap[k] = mergeMaps(v1Map, v2.(map[string]interface{}))
				}
			default:
				// If the value is not a map, overwrite it with the value from m2
				mergedMap[k] = v2
			}
		}
	}

	return mergedMap
}

*/
