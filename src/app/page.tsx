import Home from "@/app/home";

const Page = async () => {
    const token = process.env.NEXT_PUBLIC_TOKEN!;
    const url: string = process.env.NEXT_PUBLIC_SERVER_URL!;

    const response = await fetch(url, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    const data = await response.json();

    return <Home props={data} />;
};

export default Page;