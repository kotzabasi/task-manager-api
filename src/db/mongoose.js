const mongoose = require('mongoose')


//like mongodb you provide url and option object. You DO NOT provide database name as const
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:true
})












