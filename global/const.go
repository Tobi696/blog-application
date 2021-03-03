package global

const (
	dburi       = "mongodb+srv://standard:example@cluster0.f5yec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	dbname      = "blog-application"
	performance = 100
)

var (
	jwtSecret = []byte("blogSecret")
)
