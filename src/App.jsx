import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Switch,
  CssBaseline,
  Pagination,
  Grid,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Componente para entrada de nomes com paginação
function NamesInput({ value, onChange }) {
  const [names, setNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newName, setNewName] = useState('');
  const namesPerPage = 15;

  // Inicializar a lista de nomes a partir do valor inicial
  useEffect(() => {
    if (value) {
      const initialNames = value
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      setNames(initialNames);
    }
  }, []);

  // Calcular índices para a paginação
  const indexOfLastName = currentPage * namesPerPage;
  const indexOfFirstName = indexOfLastName - namesPerPage;
  const currentNames = names.slice(indexOfFirstName, indexOfLastName);
  const totalPages = Math.ceil(names.length / namesPerPage);

  // Atualizar valor externo quando os nomes mudarem
  useEffect(() => {
    const namesString = names.join('\n');
    onChange(namesString);
  }, [names, onChange]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddName = () => {
    if (newName.trim() !== '') {
      const updatedNames = [...names, newName.trim()];
      setNames(updatedNames);
      setNewName('');
      
      // Se adicionou na última página e excedeu o número de nomes por página, avance
      if (updatedNames.length > currentPage * namesPerPage) {
        setCurrentPage(Math.ceil(updatedNames.length / namesPerPage));
      }
    }
  };

  const handleRemoveName = (index) => {
    const nameIndex = indexOfFirstName + index;
    const updatedNames = [...names];
    updatedNames.splice(nameIndex, 1);
    setNames(updatedNames);
    
    // Ajustar página atual se necessário
    if (currentNames.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddName();
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <TextField
            label="Adicionar novo nome"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddName}
            sx={{ height: '100%' }}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ mt: 2, p: 2, maxHeight: '300px', overflow: 'auto' }}>
        {currentNames.length > 0 ? (
          <List dense>
            {currentNames.map((name, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveName(index)}
                  >
                    Remover
                  </Button>
                }
              >
                <ListItemText primary={`${indexOfFirstName + index + 1}. ${name}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" align="center">
            Nenhum nome adicionado
          </Typography>
        )}
      </Paper>

      {names.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            Total: {names.length} nomes
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          )}
        </Box>
      )}
    </Box>
  );
}

function App() {
  const [raffleName, setRaffleName] = useState('');
  const [mode, setMode] = useState('names'); // 'names' or 'numbers'
  const [namesInput, setNamesInput] = useState('');
  const [totalNumbers, setTotalNumbers] = useState(10);
  const [drawCount, setDrawCount] = useState(3);
  const [numberOfDraws, setNumberOfDraws] = useState(1);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [countdown, setCountdown] = useState(null);
  const [results, setResults] = useState([]); // array of arrays for multiple draws
  const [drawing, setDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const countdownRef = useRef(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      performDraw();
      setDrawing(false);
      setCountdown(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      return;
    }

    countdownRef.current = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(countdownRef.current);
  }, [countdown]);

  const handleStart = () => {
    if (mode === 'names') {
      const namesArray = namesInput
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      if (namesArray.length === 0) {
        alert('Por favor, insira pelo menos um nome para o sorteio.');
        return;
      }
    } else {
      if (
        totalNumbers < drawCount ||
        totalNumbers <= 0 ||
        drawCount <= 0 ||
        numberOfDraws <= 0
      ) {
        alert('Por favor, insira números válidos para o sorteio.');
        return;
      }
    }
    setResults([]);
    setDrawing(true);
    setCountdown(countdownSeconds);
  };

  const performDraw = () => {
    let allResults = [];
    for (let i = 0; i < numberOfDraws; i++) {
      if (mode === 'names') {
        const namesArray = namesInput
          .split('\n')
          .map((n) => n.trim())
          .filter((n) => n.length > 0);
        const shuffled = shuffleArray(namesArray);
        allResults.push(shuffled.slice(0, drawCount));
      } else {
        const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
        const shuffled = shuffleArray(numbers);
        allResults.push(shuffled.slice(0, drawCount));
      }
    }
    setResults(allResults);
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img src="/logo.png" alt="Company Logo" style={{ maxHeight: 120 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ flexGrow: 1 }}>
              Sorteios CESAM
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  color="primary"
                />
              }
              label={darkMode ? 'Modo Escuro' : 'Modo Claro'}
            />
          </Box>

          <TextField
            label="Nome do Sorteio"
            fullWidth
            value={raffleName}
            onChange={(e) => setRaffleName(e.target.value)}
            margin="normal"
          />

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Modo de Sorteio</FormLabel>
            <RadioGroup
              row
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <FormControlLabel value="names" control={<Radio />} label="Nomes" />
              <FormControlLabel
                value="numbers"
                control={<Radio />}
                label="Números"
              />
            </RadioGroup>
          </FormControl>

          {mode === 'names' ? (
            <NamesInput value={namesInput} onChange={setNamesInput} />
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Total de números"
                type="number"
                fullWidth
                value={totalNumbers}
                onChange={(e) =>
                  setTotalNumbers(Math.max(1, parseInt(e.target.value) || 1))
                }
                margin="normal"
              />
              <TextField
                label="Quantos serão sorteados"
                type="number"
                fullWidth
                value={drawCount}
                onChange={(e) =>
                  setDrawCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                margin="normal"
              />
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Número de sorteios"
              type="number"
              fullWidth
              value={numberOfDraws}
              onChange={(e) =>
                setNumberOfDraws(Math.max(1, parseInt(e.target.value) || 1))
              }
              margin="normal"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Tempo de contagem regressiva (segundos): {countdownSeconds}
            </Typography>
            <Slider
              value={countdownSeconds}
              onChange={(e, val) => setCountdownSeconds(val)}
              min={1}
              max={30}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
              disabled={drawing}
              size="large"
            >
              {drawing ? 'Sorteando...' : 'Iniciar Sorteio'}
            </Button>
          </Box>

          {drawing && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6">Contagem regressiva: {countdown}</Typography>
              <CircularProgress
                variant="determinate"
                value={((countdownSeconds - countdown) / countdownSeconds) * 100}
                size={80}
                thickness={5}
                sx={{ mt: 2 }}
              />
            </Box>
          )}

          {!drawing && results.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Resultado do Sorteio {raffleName ? `- ${raffleName}` : ''}
              </Typography>
              {results.map((resultSet, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sorteio {index + 1}
                  </Typography>
                  <List>
                    {resultSet.map((item, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
        {showConfetti && <Confetti width={width} height={height} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
