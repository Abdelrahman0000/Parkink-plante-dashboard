import LoginForm from "./LoginCompo/LoginForm";
import Img from "../../assets/parking.png";
import "./login.css";
export default function Login() {
  return (
    <div className="login ">
      <div className="flex flex-row md:flex-col-reverse h-[100vh] md:h-auto">
        <div className="left flex w-5/12">
          <div className="left-inner">
            <h1 className="text-5xl ">Welcome , sir</h1>
            <p className="text-3xl">Please login to your account</p>
            <LoginForm />
          </div>
        </div>
        <div className="right w-7/12  ">
          <img className="w-[100%] h-[100%]" src={Img} />
        </div>
      </div>
    </div>
  );
}
