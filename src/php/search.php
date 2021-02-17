<?php
require_once 'settings.php';

class SearchMovies
{
    private $curl = null;
    private $API_KEY = '';
    private $data = '';
    private $fields = [];
    private $moviesArr = [];


    public function getData(): string
    {
        return $this->data;
    }

    public function setData(string $data)
    {
        $this->data = $data;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setFields(array $fields)
    {
        $this->fields = $fields;
    }

    public function getMoviesArr(): array
    {
        return $this->moviesArr;
    }

    public function setMoviesArr(array $moviesArr)
    {
        $this->moviesArr = $moviesArr;
    }

    private function getAPI_KEY()
    {
        return $this->API_KEY;
    }

    private function setAPI_KEY(string $API_KEY)
    {
        $this->API_KEY = $API_KEY;
    }

    function __construct(string $API_KEY, string $data, array $fields)
    {
        if (!$API_KEY) {
            die();
        }

        $this->API_KEY = $API_KEY;
        $this->data = $data;
        if (count($this->fields) == 0) {
            $this->fields = ['title',
                'type',
                'year',
                'genres',
                'releaseDate',
                'image',
                'plot',
                'directors',
                'writers',
                'stars'
            ];
        } else {
            $this->fields = $fields;
        }

    }

    private function responseToAPI(string $API, $data)
    {
        $this->curl = curl_init();

        curl_setopt_array($this->curl, array(
            CURLOPT_URL => "https://imdb-api.com/en/API/$API/$this->API_KEY/$data",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
        ));



        $response = json_decode(curl_exec($this->curl));
        if(!$response || $response->errorMessage){
            die();
        }
        $requiredFields = new stdClass();
        if (strcasecmp($API, 'title') == 0) { //собираем от API только ненулевые поля и которые есть в settings.php
            foreach ($response as $key => $field) {
                if (in_array($key, $this->fields)) {
                    if ($field) {
                        $requiredFields->$key = $field;
                    }
                }
            }
            return $requiredFields;
        }

        curl_close($this->curl);

        return $response;
    }

    public function getMovies()
    {
        $movies_id = $this->get_id('movies');
        $series_id = $this->get_id('serials');
        $all_id = array_merge($movies_id, $series_id);
        foreach ($all_id as $id) {
            $responce = $this->responseToAPI('Title', $id); //получаем фильм/сериал по id
            $film = array();
            foreach ($responce as $key => $value) {
                $film[$key] = $value;
            }
            $this->moviesArr[] = $film;
        }
        return $this->moviesArr;
    }

    public function get_id(string $type)
    {
        if (strtolower($type) === 'serials') {
            $response = $this->responseToAPI('SearchSeries', $this->data);

            $arr = [];
            foreach ($response->results as $serial) {
                $arr[] = $serial->id;
            }

            return $arr;
        } elseif (strtolower($type) === 'movies') {
            $response = $this->responseToAPI('SearchMovie', $this->data);

            $arr = [];
            foreach ($response->results as $movie) {
                $arr[] = $movie->id;
            }

            return $arr;
        }
    }

}


$search = new SearchMovies($API_KEY, "{$_GET['title']}", $fields);
$searchResults = $search->getMovies();
echo json_encode($searchResults);


?>