const supabase = require('../supabase'); // Agora, quando ele for lido, as variáveis já existem


exports.test = (req,res) => 
    {
       res.send("test");
    }

    exports.GetListarUsuario = async (req,res) => 
    {
        try{
           const {data, error} = await supabase.from('usuarios').select('nome');
           console.log(data);
        }
        catch{
            console.log("erro");
        }
        
       res.render("usuario", 
        {
           usuario: ["1","2","3"],
        })
    }

    exports.PostCriarUsuario = (req,res) => 
    {
       res.send("test");
    }