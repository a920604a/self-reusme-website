import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xdaylpgp";

const useSubmit = () => {
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const submit = async (_url, data) => {
    setLoading(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.firstName,
          email: data.email,
          subject: data.subject,
          message: data.comment,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setResponse({
        type: "success",
        message: `Thanks for your message, ${data.firstName}! I'll get back to you shortly.`,
      });
    } catch {
      setResponse({
        type: "error",
        message: "Something went wrong. Please try again or email me directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, response, submit };
};

export default useSubmit;
