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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
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
  const [bulkNamesOpen, setBulkNamesOpen] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
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

  const handleBulkNamesOpen = () => {
    setBulkNamesOpen(true);
  };

  const handleBulkNamesClose = () => {
    setBulkNamesOpen(false);
    setBulkNames('');
  };

  const handleBulkNamesAdd = () => {
    if (bulkNames.trim() !== '') {
      const newNames = bulkNames
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (newNames.length > 0) {
        const updatedNames = [...names, ...newNames];
        setNames(updatedNames);
        
        // Avance para a página que contém o primeiro nome adicionado
        const newTotalPages = Math.ceil(updatedNames.length / namesPerPage);
        if (newTotalPages > currentPage) {
          setCurrentPage(newTotalPages);
        }
      }
    }
    
    setBulkNamesOpen(false);
    setBulkNames('');
  };

  return (
    <Box>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            label="Adicionar novo nome"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddName}
            fullWidth
            size="small"
          >
            Adicionar
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBulkNamesOpen}
            fullWidth
            size="small"
          >
            Adicionar Vários
          </Button>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ mt: 1, p: 1, height: '200px', overflow: 'auto' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
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

      {/* Diálogo para adicionar múltiplos nomes */}
      <Dialog open={bulkNamesOpen} onClose={handleBulkNamesClose} fullWidth maxWidth="md">
        <DialogTitle>Adicionar Múltiplos Nomes</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Insira um nome por linha. Todos os nomes serão adicionados à lista.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            placeholder="João Silva&#10;Maria Oliveira&#10;Carlos Pereira"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkNamesClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleBulkNamesAdd} color="primary" variant="contained">
            Adicionar Todos
          </Button>
        </DialogActions>
      </Dialog>
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
      
      if (drawCount > namesArray.length) {
        alert(`Você está tentando sortear ${drawCount} nomes, mas só há ${namesArray.length} na lista.`);
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
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#f50057',
          },
        },
        components: {
          MuiListItem: {
            styleOverrides: {
              root: {
                paddingTop: 2,
                paddingBottom: 2,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Cabeçalho */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/logo.png" alt="Company Logo" style={{ maxHeight: 60, marginRight: 16 }} />
                  <Typography variant="h5">Sorteios CESAM</Typography>
                </Box>
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
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Área de Configuração do Sorteio */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Configuração do Sorteio</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Nome do Sorteio"
                        fullWidth
                        value={raffleName}
                        onChange={(e) => setRaffleName(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Modo de Sorteio</FormLabel>
                        <RadioGroup
                          row
                          value={mode}
                          onChange={(e) => setMode(e.target.value)}
                        >
                          <FormControlLabel value="names" control={<Radio />} label="Nomes" />
                          <FormControlLabel value="numbers" control={<Radio />} label="Números" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    
                    {mode === 'numbers' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Total de números"
                            type="number"
                            fullWidth
                            value={totalNumbers}
                            onChange={(e) =>
                              setTotalNumbers(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Quantos serão sorteados por vez"
                            type="number"
                            fullWidth
                            value={drawCount}
                            onChange={(e) =>
                              setDrawCount(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            size="small"
                            helperText={`Sorteando ${drawCount} de ${totalNumbers} números`}
                          />
                        </Grid>
                      </>
                    )}
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Número de sorteios"
                        type="number"
                        fullWidth
                        value={numberOfDraws}
                        onChange={(e) =>
                          setNumberOfDraws(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        size="small"
                      />
                    </Grid>
                    
                    {mode === 'names' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nomes sorteados por vez"
                          type="number"
                          fullWidth
                          value={drawCount}
                          onChange={(e) =>
                            setDrawCount(Math.max(1, parseInt(e.target.value) || 1))
                          }
                          size="small"
                          helperText={namesInput ? 
                            `Sorteando ${drawCount} de ${namesInput.split('\n').filter(n => n.trim().length > 0).length} nomes` : 
                            "Adicione nomes primeiro"}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>
                        Tempo de contagem regressiva: {countdownSeconds} segundos
                      </Typography>
                      <Slider
                        value={countdownSeconds}
                        onChange={(e, val) => setCountdownSeconds(val)}
                        min={1}
                        max={30}
                        valueLabelDisplay="auto"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStart}
                      disabled={drawing}
                      size="large"
                      sx={{ minWidth: 150 }}
                    >
                      {drawing ? 'Sorteando...' : 'Iniciar Sorteio'}
                    </Button>
                  </Box>
                  
                  {drawing && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="h5">Contagem: {countdown}</Typography>
                      <CircularProgress
                        variant="determinate"
                        value={((countdownSeconds - countdown) / countdownSeconds) * 100}
                        size={60}
                        thickness={5}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Área de Lista de Nomes ou Resultados */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  {mode === 'names' ? (
                    <>
                      <Typography variant="h6" gutterBottom>Lista de Participantes</Typography>
                      <NamesInput value={namesInput} onChange={setNamesInput} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>Configuração do Sorteio de Números</Typography>
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body1" gutterBottom>
                          Modo de sorteio de números selecionado.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Serão sorteados {drawCount} números entre 1 e {totalNumbers}.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Número de sorteios: {numberOfDraws}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {/* Exibição dos Resultados */}
                  {!drawing && results.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="h6" gutterBottom color="primary">
                        Resultado do Sorteio {raffleName ? `- ${raffleName}` : ''}
                      </Typography>
                      
                      <Grid container spacing={1}>
                        {results.map((resultSet, index) => (
                          <Grid item xs={12} sm={numberOfDraws > 1 ? 6 : 12} key={index}>
                            <Card variant="outlined" sx={{ mb: 1 }}>
                              <CardContent sx={{ p: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Sorteio {index + 1}
                                </Typography>
                                <List dense sx={{ p: 0 }}>
                                  {resultSet.map((item, idx) => (
                                    <ListItem key={idx} divider={idx < resultSet.length - 1}>
                                      <ListItemText 
                                        primary={`${idx + 1}. ${item}`} 
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        {showConfetti && <Confetti width={width} height={height} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;