import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import districts from "../data/districts.json";
import providers from "../data/providers.json";
import axios from "axios";
import {Button, Card, Container, Divider, TextareaAutosize, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const googleSearchCx = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;
const backendUrl = process.env.REACT_APP_BACKEND_1;
const dbUrl = process.env.REACT_APP_BACKEND_2; // /api/municipalities

providers = providers
    .filter(p => p.Link && p.Link.trim().length > 0)
    .filter(p => p.Link.startsWith("https"));

districts.Daten = districts.Daten.slice(0, 2);

async function requestScraping(url, body) {
    return axios({
        method: "post",
        url: url,
        data: body
    });
}

async function saveToDatabase(url, body) {
    return axios({
        method: "post",
        url: `${dbUrl}/api/municipalities`,
        data: body
    });
}

function Scrape() {
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState({
        providers: 0,
        municipalities: 0
    });
    const [searchString, setSearchString] = useState("Energie");
    useEffect(() => {

    }, [])
    const scrapeGoogle = async (searchText) => {
        let response = await axios({
            method: "get",
            url: `https://customsearch.googleapis.com/customsearch/v1?q=${searchText}&cx=${googleSearchCx}&key=${googleApiKey}`,
            headers: {
                "Accept": "application/json"
            }
        });
        return response;
    }
    const scrapeProviders = async () => {
        for (let i = 0; i < providers.length; i++) {
            let provider = providers[i];
            console.log(`scraping provider ${provider.Name}: ${provider.Link}`, provider);
            let response = await requestScraping(backendUrl, {
                url: provider.Link
            }).catch(e => e.response);
            setProgress(p => {
                return {
                    ...p,
                    providers: i,
                }
            });
            await onMunicipalityScraped({
                "Guid": "",
                "Source": "provider",
                "Name": provider.Name,
                "Links": [
                    {
                        "Uri": provider.Link,
                        "Html": response.data.html,
                        "Text": response.data.text
                    }
                ]
            })
        }
    }
    const onMunicipalityScraped = async (body) => {
        await saveToDatabase(body);
    }
    return (
        <Card id={"App"} style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography variant={"h6"}>Service Providers</Typography>
            <TextareaAutosize
                value={providers.map(p => p.Link).join("\n")}
                maxRows={10}
                style={{
                    minWidth: "400px",
                    minHeight: "200px",
                    maxHeight: "300px"
                }}>
            </TextareaAutosize>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Button onClick={async () => {
                    await scrapeProviders();
                }}>
                    scan providers
                </Button>
                <div>{progress.providers}/{providers.length}</div>
            </Container>
            <Divider style={{width: "100%"}}></Divider>
            <Typography variant={"h6"}>Municipalities</Typography>
            <TextField
                style={{
                    minWidth: "400px",
                    marginBottom: "5px"
                }}
                value={searchString}
                onChange={(e) => {
                    setSearchString(e.target.value)
                }}
            ></TextField>
            <TextareaAutosize
                value={districts.Daten.map(d => d.Gemeindename).join("\n")}
                maxRows={10}
                style={{
                    minWidth: "400px",
                    minHeight: "200px",
                    maxHeight: "300px"
                }}>
            </TextareaAutosize>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Button onClick={async () => {
                    for (let i = 0; i < districts.Daten.length; i++) {
                        let municipality = districts.Daten[i];
                        let result = await scrapeGoogle(`${municipality.Gemeindename} ${searchString}`);
                        let links = result.data.items
                            .map(item => item.formattedUrl)
                            .filter(link => link.startsWith("https") && link.toLowerCase().endsWith("pdf") === false)
                            .slice(0, 4);
                        let body = {
                            "Guid": "",
                            "Source": `google (${searchString})`,
                            "Name": municipality.Gemeindename,
                            "Links": []
                        };
                        for (let j = 0; j < links.length; j++) {
                            let link = links[j];
                            let scrapeResponse = await requestScraping(backendUrl, {
                                url: link
                            }).catch(e => e.response);
                            console.log(municipality.Gemeindename, scrapeResponse.data);
                            body.Links.push({
                                "Uri": link,
                                "Html": scrapeResponse.data.html,
                                "Text": scrapeResponse.data.text
                            })
                        }
                        await onMunicipalityScraped(body)
                    }
                }}>
                    scan municipalities
                </Button>
                <div>{progress.municipalities}/{districts.Daten.length}</div>
            </Container>
        </Card>
    );
}

function Util() {
    return (
        <div>
            Util
        </div>
    )
}

function Home() {
    return (
        <div>
            Home
        </div>
    )
}


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Scrape/>}/>
                <Route path="/util" element={<Util/>}/>
                <Route path="/scrape" element={<Scrape/>}/>
            </Routes>
        </BrowserRouter>
    )
}