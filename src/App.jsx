import "./App.css";
import MainContent from "./components/mainContent";
import Container from "@mui/material/Container";
function App() {
  return (
    <>
      <div style={{
        display:"flex",
        justifyContent: "center",
        alignItems: 'center',
        width: "100vw"
      }}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
