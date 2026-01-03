"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Accordion, Breadcrumb, Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from '@/i18n/routing';
import {
  FireflyParams,
  FireflyState,
  initializeAlgorithm,
  runIteration,
} from '@/lib/algorithms/firefly/firefly-algorithm';
import { objectiveFunction2D, generatePlotData } from '../objective-function';
import Plot from './plotly-chart';
import { useTheme } from '@/hooks/useTheme';
import { usePlotlyTheme } from '@/hooks/use-plotly-theme';
import GlowLink from '@/components/GlowLink';


const baseTPath = 'components.Ffy2DContainer';

interface Ffy2DContainerProps {
}

const Ffy2DContainer: React.FC<Ffy2DContainerProps> = () => {
  const t = useTranslations(baseTPath);
  const { theme } = useTheme();
  const plotlyTheme = usePlotlyTheme(theme);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Algorithm parameters
  const [params, setParams] = useState<FireflyParams>({
    n: 10,
    lb: -3,
    ub: 3,
    beta0: 1,
    alpha: 0.1,
    gamma: 0.1,
    delta: 0.98,
    maxIterations: 60,
  });

  // Algorithm state
  const [state, setState] = useState<FireflyState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize the algorithm
  const initialize = useCallback(() => {
    const initialState = initializeAlgorithm(
      params,
      objectiveFunction2D,
      1 // 1D problem (only x dimension)
    );
    setState(initialState);
    setIsPlaying(false);
  }, [params]);

  // Run one iteration
  const stepIteration = () => {
    if (!state || state.iteration >= params.maxIterations) return;

    const newState = runIteration(state, params, objectiveFunction2D);
    setState(newState);
  };

  // Animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && state && state.iteration < params.maxIterations) {
      timer = setTimeout(() => {
        const newState = runIteration(state, params, objectiveFunction2D);
        setState(newState);
      }, 500); // 500ms per iteration
    } else if (state && state.iteration >= params.maxIterations) {
      setIsPlaying(false);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, state, params]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Generate objective function curve for plotting
  const plotData = generatePlotData(params.lb as number, params.ub as number);


  return (
    <>
      <Container fluid className="ffy-2d-container">
        <Row className="mt-3">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item linkAs="span">
                <Link href="/visualizations">
                  <i className="bi bi-arrow-left me-1"></i>{t('backLabel')}
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="display-6 mb-4">{t('title')}</h1>
            <p>
              {t.rich('para1', {
                link: (chunks) => <GlowLink href="https://scholar.google.com/citations?user=fA6aTlAAAAAJ" newTab={true} withArrow={true}>{chunks}</GlowLink>
              })}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion className="mb-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>{t('moreLabel')}</Accordion.Header>
                <Accordion.Body>
                  <p>{t('para2')}</p>
                  <ul>
                    <li>{t('item1')}</li>
                    <li>{t('item2')}</li>
                    <li>{t('item3')}</li>
                  </ul>
                  <p>{t('para3')}</p>
                  <p>{t('para4')}</p>
                  <ul>
                    <li>{t('item4')}</li>
                    <li>{t('item5')}</li>
                    <li>{t('item6')}</li>
                    <li>{t('item7')}</li>
                  </ul>
                  <p>{t('para5')}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col lg={9}>
            <div>
              {/* Iteration Info Bar */}
              {state && (
                <Card className='mb-3 p-3'>
                  <Row>
                    <Col>
                      <strong>{t('iteration')}:</strong> {state.iteration} / {params.maxIterations}
                    </Col>
                    <Col className="text-center">
                      <strong>{t('bestPosition')}:</strong> x = {state.bestPosition[0].toFixed(4)}
                    </Col>
                    <Col className="text-end">
                      <strong>{t('bestFitness')}:</strong> y = {state.bestFitness.toFixed(6)}
                    </Col>
                  </Row>
                </Card>
              )}

              <div>
                <h5 className="d-md-none mb-2 text-center">{t('chartTitle')}</h5>
              </div>

              {/* Plotly Chart */}
              {state && (
                <Plot
                  className='mb-3'
                  data={[
                    // 1. Objective function curve (blue line)
                    {
                      x: plotData.x,
                      y: plotData.y,
                      type: 'scatter',
                      mode: 'lines',
                      name: 'y = (x/5 - x³) × e^(-2x²)',
                      line: { 
                        color: '#0d6efd', 
                        width: 2 
                      },
                      hovertemplate: 'x: %{x:.4f}<br>y: %{y:.6f}<extra></extra>',
                    },
                    // 2. Firefly positions (red circles)
                    {
                      x: state.positions.map(pos => pos[0]),
                      y: state.fitness,
                      type: 'scatter',
                      mode: 'markers',
                      name: t('fireflies'),
                      marker: {
                        color: '#dc3545',
                        size: 10,
                        line: { color: '#fff', width: 1 }
                      },
                      hovertemplate: `${t('fireflies')}<br>x: %{x:.4f}<br>y: %{y:.6f}<extra></extra>`,
                    },
                    // 3. Best firefly (yellow star)
                    {
                      x: [state.bestPosition[0]],
                      y: [state.bestFitness],
                      type: 'scatter',
                      mode: 'markers',
                      name: t('bestSolution'),
                      marker: {
                        color: '#ffc107',
                        size: 10,
                        symbol: 'star',
                        line: { color: '#000', width: 1 }
                      },
                      hovertemplate: `${t('bestSolution')}<br>x: %{x:.4f}<br>y: %{y:.6f}<extra></extra>`,
                    },
                  ]}
                  layout={{
                    title: isMobile ? undefined : {
                      text: t('chartTitle'),
                      font: {
                        size: 18,
                        color: plotlyTheme.title_color
                      },
                    },
                    xaxis: { 
                      title: { text: 'x' },
                      gridcolor: plotlyTheme.grid_color,
                      zeroline: true,
                      zerolinecolor: plotlyTheme.zeroline_color,
                      color: plotlyTheme.text_color,
                    },
                    yaxis: { 
                      title: { text: 'y = (x/5 - x³) × e^(-2x²)' },
                      gridcolor: plotlyTheme.grid_color,
                      zeroline: true,
                      zerolinecolor: plotlyTheme.zeroline_color,
                      color: plotlyTheme.text_color,
                    },
                    showlegend: true,
                    legend: { 
                      x: 1, 
                      y: 1,
                      xanchor: 'right',
                      bgcolor:
                        theme === 'dark'
                          ? 'rgba(0, 0, 0, 0.8)'
                          : 'rgba(255, 255, 255, 0.8)',
                      bordercolor: plotlyTheme.grid_color,
                      borderwidth: 1,
                      font: { color: plotlyTheme.text_color },
                    },
                    plot_bgcolor: plotlyTheme.plot_bg,
                    paper_bgcolor: plotlyTheme.paper_bg,
                    hovermode: 'closest',
                    margin: { l: 60, r: 40, t: 60, b: 60 },
                    autosize: true,
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                    // modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    modeBarButtonsToRemove: isMobile 
                      ? ['zoom2d', 'pan2d', 'lasso2d', 'select2d', 'autoScale2d']  // Fewer buttons on mobile
                      : ['lasso2d', 'select2d', 'autoScale2d'],  // Desktop keeps more tools
                    toImageButtonOptions: {
                      format: 'png',
                      filename: `firefly-algorithm-iteration-${state.iteration}`,
                      height: 800,
                      width: 1200,
                    }
                  }}
                  style={{ width: '100%', height: '600px' }}
                />
              )}

              {/* Show message if no state yet */}
              {!state && (
                <div className="text-center p-5 text-muted">
                  <p>{t('initVisual')}</p>
                </div>
              )}
            </div>
          </Col>

          <Col lg={3}>
            {/* Control Panel */}
            <div className="border rounded p-3 mb-3">
              {/* <h5 className="mb-3">Controls</h5> */}
              
              <ButtonGroup className="w-100 mb-3">
                <Button 
                  variant={isPlaying ? "warning" : "success"}
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!state || state.iteration >= params.maxIterations}
                >
                  {
                    isPlaying ? (
                      <>
                        <i className="bi bi-pause-fill me-1" />{t('pause')}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-play-fill me-1" />{t('play')}
                      </>
                    )
                  }
                </Button>
                <Button 
                  variant="secondary"
                  onClick={stepIteration}
                  disabled={isPlaying || !state || state.iteration >= params.maxIterations}
                >
                  <i className="bi bi-fast-forward-fill me-1" />{t('step')}
                </Button>
                <Button variant="danger" onClick={initialize}>
                  <i className="bi bi-arrow-counterclockwise me-1" />{t('reset')}
                </Button>
              </ButtonGroup>

              <hr />

              <h6 className="mb-3">{t('parameters')}</h6>
              
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between">
                  <span>{t('noOfFireflies')} (n)</span>
                  <span className="badge bg-secondary">{params.n}</span>
                </Form.Label>
                <Form.Range
                  value={params.n}
                  min={5}
                  max={50}
                  onChange={(e) => setParams({...params, n: parseInt(e.target.value)})}
                  disabled={isPlaying}
                />
                {/* <small className="text-muted">More = better exploration</small> */}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between">
                  <span>{t('randomization')} (α)</span>
                  <span className="badge bg-secondary">{params.alpha}</span>
                </Form.Label>
                <Form.Range
                  value={params.alpha}
                  min={0}
                  max={1.0}
                  step={0.01}
                  onChange={(e) => setParams({...params, alpha: parseFloat(e.target.value)})}
                  disabled={isPlaying}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between">
                  <span>{t('attractiveness')} (β₀)</span>
                  <span className="badge bg-secondary">{params.beta0}</span>
                </Form.Label>
                <Form.Range
                  value={params.beta0}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={(e) => setParams({...params, beta0: parseFloat(e.target.value)})}
                  disabled={isPlaying}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between">
                  <span>{t('absorption')} (γ)</span>
                  <span className="badge bg-secondary">{params.gamma}</span>
                </Form.Label>
                <Form.Range
                  value={params.gamma}
                  min={0}
                  max={100}
                  step={0.1}
                  onChange={(e) => setParams({...params, gamma: parseFloat(e.target.value)})}
                  disabled={isPlaying}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between">
                  <span>{t('iterations')}</span>
                  <span className="badge bg-secondary">{params.maxIterations}</span>
                </Form.Label>
                <Form.Range
                  value={params.maxIterations}
                  min={20}
                  max={100}
                  step={5}
                  onChange={(e) => setParams({...params, maxIterations: parseInt(e.target.value)})}
                  disabled={isPlaying}
                />
              </Form.Group>
            </div>

          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Ffy2DContainer;