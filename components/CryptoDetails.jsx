import React, {useState} from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Row, Col, Typography, Select } from 'antd';
import { MoneyCollectOutlined, FundOutlined, NumberOutlined, DollarCircleOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, ThunderboltOutlined, CheckOutlined } from '@ant-design/icons';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart.jsx';
import Loader from './Loader';

const { Title, Text } = Typography;
const { Option } = Select;

function CryptoDetails(){
    const [timePeriod, setTimePeriod] = useState('7d');
    const { coinId } = useParams();
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
    const { data: coinHistory } = useGetCryptoHistoryQuery({coinId, timePeriod});
    const cryptoDetails = data?.data?.coin;

    if (isFetching) return <Loader />;

    const time = ['3H', '1D', '7D', '1M', '3M', '6M', '1Y', '3Y', '5Y'];

    const stats = [
        { title: 'Price to USD', value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetails.rank, icon: <NumberOutlined /> },
        { title: '24h Volume', value: `$ ${cryptoDetails.volume && millify(cryptoDetails.volume)}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high(daily avg.)', value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`, icon: <TrophyOutlined /> },
    ];

    const genericStats = [
        { title: 'Number Of Markets', value: cryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number Of Exchanges', value: cryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Aprroved Supply', value: cryptoDetails.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: `$ ${millify(cryptoDetails.totalSupply)}`, icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: `$ ${millify(cryptoDetails.circulatingSupply)}`, icon: <ExclamationCircleOutlined /> },
    ];

    return(
        <div>
            <Col className="coin-detail-container">
                <Col className="coin-heading-container">
                    <Title level={2} className="coin-name">
                        {cryptoDetails.name} ({cryptoDetails.slug}) Price
                    </Title>
                    <p>
                        {cryptoDetails.name} Live Price in U.S. Dollars.
                        View value statistics, MarketCap and Supply.
                    </p>
                    <Select
                        defaultValue='7d'
                        className="select-timeperiod"
                        placeholder="Select Time Period"
                        onChange={ value => setTimePeriod(value) }
                     >
                        { time.map( date => <Option value={date}>{date}</Option> )}
                        
                    </Select>

                    <LineChart coinHistory={ coinHistory } currentPrice={ millify(cryptoDetails.price) } coinName={ cryptoDetails.name } />

                    <Col className="stats-container">
                        <Col className="coin-value-statistics">
                            <Col className="coin-value-statistics-heading">
                                <Title level={3} className="coin-details-heading">
                                    { cryptoDetails.name } Value Statistics
                                </Title>
                                <p>
                                    An overview showing the Stats of { cryptoDetails.name }
                                </p>
                            </Col>
                            {stats.map(({ icon, title, value})=>(
                                <Col className="coin-stats">
                                    <Col className="coin-stats-name">
                                        <Text>{icon}</Text>
                                        <Text>{title}</Text>
                                    </Col>   
                                    <Text className="stats">{value}</Text>
                                </Col>
                            ))}
                        </Col>
                        <Col className="other-stats-info">
                            <Col className="coin-value-statistics-heading">
                                <Title level={3} className="coin-details-heading">
                                    Other Statistics
                                </Title>
                                <p>
                                    An overview showing the Stats of all Cryptocurrencies.
                                </p>
                            </Col>
                            {genericStats.map(({ icon, title, value})=>(
                                <Col className="coin-stats">
                                    <Col className="coin-stats-name">
                                        <Text>{icon}</Text>
                                        <Text>{title}</Text>
                                    </Col>   
                                    <Text className="stats">{value}</Text>
                                </Col>
                            ))}
                        </Col>
                    </Col>
                </Col>
                <Col className="coin-desc-link">
                    <Row className="coin-desc">
                        <Title level={3} className="coin-details-heading">
                            What is {cryptoDetails.name}
                            {HTMLReactParser(cryptoDetails.description)}
                        </Title>
                    </Row>
                    <Col className="coin-links">
                        <Title level={3} className="coin-details-heading">
                            {cryptoDetails.name} Links
                        </Title>
                        {cryptoDetails.links.map((link)=>(
                            <Row className="coin-link" key={link.name}>
                                <Title level={5} className="link-name">
                                    {link.type}
                                </Title>
                                <a href={link.url} target="_blank" rel="noreferrer">
                                    {link.name}
                                </a>

                            </Row>
                        ))}
                    </Col>
                </Col>
            </Col>
        </div>
    )
}

export default CryptoDetails;
