import React from 'react';
import overleaf from "@/public/icons/overleaf-o-original.svg";
import gnuplot from "@/public/icons/gnuplot-original.svg";
import matlab from "@/public/icons/matlab-original.svg";
import latex from "@/public/icons/latex-original.svg";
import tex from "@/public/icons/tex-original.svg";
import python from "@/public/icons/python-original.svg";
import anaconda from "@/public/icons/anaconda-original.svg";
import matplotlib from "@/public/icons/matplotlib-original.svg";
import prolog from "@/public/icons/prolog-original.svg";
import uml from "@/public/icons/unifiedmodelinglanguage-original.svg";
import apachespark from "@/public/icons/apachespark-original.svg";
import pycharm from "@/public/icons/pycharm-original.svg";
import spss from "@/public/icons/spss-original.svg";
import rlang from "@/public/icons/r-original.svg";
import rstudio from "@/public/icons/rstudio-original.svg";
import jupyter from "@/public/icons/jupyter-original.svg";
import minitab from "@/public/icons/minitab-original.svg";
import numpy from "@/public/icons/numpy-original.svg";
import scikitlearn from "@/public/icons/scikitlearn-original.svg";
import pandas from "@/public/icons/pandas-original.svg";
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import './tools-skills-displayer.scss';

const baseTPath = 'pages.Home';

const ToolsSkillsDisplayer: React.FC = () => {
  const t = useTranslations(baseTPath);

  const tools = [
    {
      img: matlab,
      title: 'Matlab'
    },
    {
      img: python,
      title: 'Python'
    },
    {
      img: anaconda,
      title: 'Anaconda'
    },
    {
      img: latex,
      title: 'Latex',
      needsBackground: true
    },
    {
      img: overleaf,
      title: 'Overleaf'
    },
    {
      img: gnuplot,
      title: 'GnuPlot'
    },
    {
      img: tex,
      title: 'Tex',
      needsBackground: true
    },
    {
      img: matplotlib,
      title: 'MatPlotLib'
    },
    {
      img: prolog,
      title: 'Prolog'
    },
    {
      img: uml,
      title: 'UML'
    },
    {
      img: apachespark,
      title: 'Apache Spark'
    },
    {
      img: pycharm,
      title: 'PyCharm'
    },
    {
      img: spss,
      title: 'SPSS'
    },
    {
      img: rlang,
      title: 'R'
    },
    {
      img: rstudio,
      title: 'RStudio'
    },
    {
      img: jupyter,
      title: 'Jupyter Notebook'
    },
    {
      img: minitab,
      title: 'Minitab'
    },
    {
      img: numpy,
      title: 'NumPy'
    },
    {
      img: scikitlearn,
      title: 'scikit learn'
    },
    {
      img: pandas,
      title: 'pandas',
      needsBackground: true
    },
  ];

  return (
    <div className='tools-skills-displayer'>
      <Row className="mb-3">
        <h3>{t('technicalSkillsTitle')}</h3>
      </Row>
      <Row className="my-4" xs={3} sm={6} md={8} lg={12}>
        {tools.map((tool, index) => (
          <Col key={index}>
            <div className="d-flex justify-content-center mb-2">
              <Image src={tool.img} height={48} alt={tool.title} className={tool.needsBackground ? 'needs-bg' : ''} />
            </div>
            <p className="text-center">{tool.title}</p>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ToolsSkillsDisplayer