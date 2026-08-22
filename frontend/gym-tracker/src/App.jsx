import WorkoutList from "./pages/WorkoutList";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="app">
      <header className="navbar">
        <h2>Gym Tracker</h2>
      </header>

      <WorkoutList />

      <Footer />
    </div>
  );
};

export default App;