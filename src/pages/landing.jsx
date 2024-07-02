import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const LandingPage = () => {

  //state for the input
  const [longUrl, setLongUrl] = useState();
  //state for navigate(The navigate function allows you to redirect users to different pages based on certain actions or conditions, such as after a form submission or when a button is clicked.)
  const navigate = useNavigate();

  //state for the form
  const handleShorten = (e) =>{
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);

  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The Best TRIM URL APP <br/> For You
      </h2>
      <form 
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter Your Long URL Here"
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button
          className="h-full" type="submit" variant="destructive"
        >Trim This</Button>
      </form>
      <img src="banner1.png" alt="banner" className="w-full my-11 md:px-11"/>

      <Accordion type="multiple" collapsible="true" className="w-full md:px-11">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it Free?</AccordionTrigger>
    <AccordionContent>
      Yes. It is free for everyone. You can create an account and use it for free.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it easy to access?</AccordionTrigger>
    <AccordionContent>
      Yes. It is easy to access from other.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Do I need an account to use the app?</AccordionTrigger>
    <AccordionContent>
      Yes. You can create an account to manage your URLs and others features like view, analytics, and customize your short URLs.
    </AccordionContent>
  </AccordionItem>
</Accordion>

    </div>
  )
}

export default LandingPage;