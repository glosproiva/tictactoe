package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/mattn/go-sqlite3"
)

type Game struct {
	Id      int    `json:"game_id"`
	Size    int    `json:"board_size"`
	Winner  int    `json:"winner"`
	History string `json:"all_trun"`
}

type Responsevalue struct {
	Result  int         `json:"result"`
	Message string      `json:"message"`
	Value   interface{} `json:"value"`
}

const (
	listening_port = "25670"
	ok_code        = 200
	db_name        = "./game.db"
)

var (
	db  *sql.DB
	res bool
)

func main() {
	var err error
	db, err = sql.Open("sqlite3", db_name)
	res = checkErr(err)
	if !res {
		return
	}

	defer db.Close()

	var (
		e = echo.New()
	)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
	}))

	g := e.Group("/v1")
	g.POST("/gethistory", gethistory)
	g.POST("/savehistory", savehistory)

	log.Fatal(e.Start(":" + listening_port))
}

func gethistory(c echo.Context) (err error) {
	// return c.JSON(statuscode, res)
	g := []Game{}
	r := Responsevalue{}

	stmt, err := db.Prepare("SELECT board_size, winner, all_trun FROM game_history")
	res = checkErr(err)
	if !res {
		r.Result = -1
		r.Message = "can't query"
		c.JSON(ok_code, r)
		return
	}

	rows, err := stmt.Query()
	res = checkErr(err)
	if !res {
		r.Result = -1
		r.Message = "can't query."
		c.JSON(ok_code, r)
		return
	}

	defer rows.Close()
	for rows.Next() {
		game := Game{}
		err = rows.Scan(&game.Size, &game.Winner, &game.History)
		res = checkErr(err)
		if !res {
			r.Result = -1
			r.Message = "can't query"
			c.JSON(ok_code, r)
			return
		}
		g = append(g, game)
	}

	fmt.Println("total rows : ", len(g))

	r.Result = 1
	r.Message = "successfully"
	r.Value = g
	c.JSON(ok_code, r)
	return
}

func savehistory(c echo.Context) (err error) {
	// BodyMap := map[string]interface{}{}
	g := Game{}
	r := Responsevalue{}

	c.Bind(&g)

	fmt.Println(" db : ", db)
	fmt.Println("game : ", g)

	stmt, err := db.Prepare("INSERT INTO game_history(board_size, winner, all_trun) values(?,?,?)")
	res = checkErr(err)
	if !res {
		r.Result = -1
		r.Message = "can't insert information"
		c.JSON(ok_code, r)
		return
	}

	result, err := stmt.Exec(g.Size, g.Winner, g.History)
	res = checkErr(err)
	if !res {
		r.Result = -1
		r.Message = "can't insert information."
		c.JSON(ok_code, r)
		return
	}

	affect, err := result.RowsAffected()
	checkErr(err)

	fmt.Println("affect row : ", affect)
	stmt.Close()

	r.Result = 1
	r.Message = "successfully"
	c.JSON(ok_code, r)
	return
}

func checkErr(err error) bool {
	if err != nil {
		fmt.Println("Error : ", err)
		return false
	}

	return true
}
