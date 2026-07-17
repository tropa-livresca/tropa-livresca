import {Routes, Route, Navigate} from "react-router-dom";

import Teste from "../painelBlog/pages/Teste/Teste";

const RoutesAdm = () => {
    return(
        <Routes>
            <Route path = "/painelBlog" element = {<Teste/>}/>
        </Routes>
    );
}

export default RoutesAdm;