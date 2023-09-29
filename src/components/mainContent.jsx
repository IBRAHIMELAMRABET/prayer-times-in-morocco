import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment/moment";
import axios from "axios";
import { useState, useEffect } from "react";

export default function MainContent() {
  const [timings, setTimings] = useState({
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [city, setCity] = useState("Casablanca");

  const availableCitys = [
    "Casablanca",
    "Tangier",
    "Marrakesh",
    "Rabat",
    "Meknes",
    "Agadir",
    "Essaouira",
    "Errachidia",
  ];

  const prayerArray = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const [today, setToday] = useState("");
  const [nextPrayer, setNextPrayer] = useState(0);
  const [timer, setTimer] = useState("");

  const getTimings = async () => {
    const data = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=MA&city=${city}`
    );
    setTimings(data.data.data.timings);
  };

  useEffect(() => {
    setInterval(() => {
      const t = moment();
      setToday(t.format("MMMM Do YYYY | hh:mm "));
    }, 1000);
  }, []);

  useEffect(() => {
    getTimings();
  }, [city]);

  useEffect(() => {
    let secondInterval = setInterval(() => {
      setUpCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(secondInterval);
    };
  }, [timings]);

  const setUpCountdownTimer = () => {
    const timeNow = moment();

    let nextPrayerIndex = 0;

    if (
      timeNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      nextPrayerIndex = 1;
    } else if (
      timeNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      nextPrayerIndex = 2;
    } else if (
      timeNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      nextPrayerIndex = 3;
    } else if (
      timeNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      timeNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      nextPrayerIndex = 4;
    }

    setNextPrayer(nextPrayerIndex);

    const nextPrayer = prayerArray[nextPrayerIndex];
    const nextPrayerTiming = timings[nextPrayer];

    let remainingTime = moment(nextPrayerTiming, "hh:mm").diff(timeNow);

    if (remainingTime < 0) {
      const midNightDiff = moment("23:59:59", "hh:mm:ss").diff(timeNow);
      const fajrToMiddNight = moment(nextPrayerTiming, "hh:mm").diff(
        moment("00:00:00", "hh:mm:ss")
      );
      remainingTime = midNightDiff + fajrToMiddNight;
    }

    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);
    setTimer(
      `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
    );
  };



  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <>
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{city}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>Remains until the {prayerArray[nextPrayer]}</h2>
            <h1>{timer}</h1>
          </div>
        </Grid>
      </Grid>
      <Divider variant="middle" />

      <Stack
        direction="row"
        justifyContent={"space-between"}
        style={{ marginTop: "50px" }}
      >
        <Prayer img="public/images/Fajr.jpeg" name="Fajr" time={timings.Fajr} />
        <Prayer
          img="public/images/Dhuhr.jpeg"
          name="Dohr"
          time={timings.Dhuhr}
        />
        <Prayer img="public/images/Asr.jpeg" name="Asr" time={timings.Asr} />
        <Prayer
          img="public/images/Maghrib.jpeg"
          name="Maghrib"
          time={timings.Maghrib}
        />
        <Prayer img="public/images/Isha.jpeg" name="Isha" time={timings.Isha} />
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"center"}
        style={{ marginTop: "30px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">City</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="City"
            onChange={handleCityChange}
          >
            {availableCitys.map((city, index) => {
              return (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
