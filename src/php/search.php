<?php

class SearchMovies
{
    private $curl = null;
    private $API_KEY = '';
    private $data = '';
    private $moviesArr =[];

    function __construct(string $API_KEY, string $data)
    {
        $this->API_KEY = $API_KEY;
        $this->data = $data;
    }

    private function getAPI_KEY()
    {
        return $this->API_KEY;
    }

    private function setAPI_KEY(string $API_KEY)
    {
        $this->API_KEY = $API_KEY;
    }

    private function responseToAPI(string $API, $data){
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
        curl_close($this->curl);

        return $response;
    }
    public function collectMovies(array $arr){
        foreach ($arr as $id){
           $responce = $this->responseToAPI('Title', $id);
           $this->moviesArr[] = array(
                'title'=>$responce->fullTitle,
                'type'=>$responce->type,
                'year'=>$responce->year,
                'genres'=>$responce->genres,
                'releaseDate'=>$responce->releaseDate,
                'image'=>$responce->image,
                'plot'=>$responce->plot,
                'directors'=>$responce->directors,
                'writers'=>$responce->writers,
                'stars'=>$responce->stars,
            );
        }
    }
    public function getMoviesAndSeries()
    {
        $moviesId = $this->getMoviesID();
        $seriesId = $this->getSeriesID();
        $this->collectMovies($moviesId);
        $this->collectMovies($seriesId);

        return $this->moviesArr;
    }

    public function getMoviesID()
    {

        $response = $this->responseToAPI('SearchMovie', $this->data);

        $arr = [];
        foreach ($response->results as $movie){
            $arr[] = $movie->id;
        }

        return $arr;
    }

    public function getSeriesID()
    {
        $response = $this->responseToAPI('SearchSeries', $this->data);

        $arr = [];
        foreach ($response->results as $serial){
            $arr[] = $serial->id;
        }

        return $arr;
    }

}


$search = new SearchMovies('k_q6fsy7pr', "{$_GET['title']}");
$searchResults = $search->getMoviesAndSeries();

echo json_encode($searchResults);

?>