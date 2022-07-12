import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Auctions from "./pages/Auctions";
import {MyAuctions} from "./pages/MyAuctions";
import AuctionItem from "./pages/AuctionItem";
import ButtonsComponent from "./components/ButtonsComponent";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";

function App() {


    return (
      <div className="App" style={{height: '100%', minHeight: '100vh', backgroundColor: '#FFFDC8', paddingLeft: 10, paddingRight: 10}}>
          <h1> Auction App </h1>



          <Router>
              <ButtonsComponent />

            <Routes>
            <Route path='/' element={<Auctions />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/auctions' element={<Auctions />}/>
              <Route path='/auction/:auctionId' element={<AuctionItem />}/>
            <Route path='/my-auctions' element={<MyAuctions />}/>
                <Route path='/profile' element={<Profile />}/>
                <Route path='/edit-user' element={<EditUser />}/>



            </Routes>
        </Router>
      </div>
  );
}

export default App;
