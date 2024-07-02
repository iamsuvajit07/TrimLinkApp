import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";


//Loading indicator use react-spinners(BitLoader)
//for validating our input field use react-spinners yup

const Login = () => {

    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const navigate = useNavigate();

    //state for string all of our errors(by default take an empty array)

    const [errors, setErrors] = useState({});
    //state for the form
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    //state for changing the input data
    const handleInputChange = (e) => {
        const { name, value } = e.target; //name and the value for that particular input
        setFormData((prevState) => ({//take whatever the previous state is
            ...prevState, //spread the previousState
            [name]: value,//newState
        }));
    };

    const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
    const { fetchUser } = UrlState();

    useEffect(() => {//this will run if the data and the error changed
        // console.log(data);
        if (error === null && data) {//means we have successfully logged in
            fetchUser();
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);//route to the dashboard page
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);

    //validating these inputs
    const handleLogin = async () => {
        setErrors([]);
        try {
            //create a schema
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Invalid Email")
                    .required("Email is Required"),
                password: Yup.string()
                    .min(6, "Password Must be at Least 6 Characters")
                    .required("Password is Required"),
            });

            await schema.validate(formData, { abortEarly: false });

            //api call
            await fnLogin();
        } catch (e) {
            const newErrors = {};

            e?.inner?.forEach((err) => {//this is the inner object that is provided to us when it throws an error
                newErrors[err.path] = err.message;//catch the new error
            });

            setErrors(newErrors);//set the new error
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login if you have already an account</CardDescription>
                {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter Your Email"
                        onChange={handleInputChange}
                    />
                </div>
                    {errors.email && <Error message={errors.email} />}
                <div className="space-y-1">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter Your Password"
                        onChange={handleInputChange}
                    />
                </div>
                    {errors.password && <Error message={errors.password} />}
            </CardContent>
            <CardFooter>
                <Button onClick={handleLogin}>
                    {loading ? <BeatLoader size={10} color="#2596be" /> : "Login"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Login;