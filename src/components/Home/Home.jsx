import React, { useEffect, useState } from 'react'
import { Layout, Menu, Table, Input, Button, AutoComplete } from 'antd';
import axios from 'axios';
import { Loading } from '../Loading/Loading';
import styles from './Home.module.css'
import {
    CloseCircleOutlined,
    DownloadOutlined,
    FilterOutlined
} from '@ant-design/icons';
import Applications from '../Applications/Applications';
import { JsonToExcel } from "react-json-to-excel";
import ProductDetails from '../ProductDetails/ProductDetails';
import suggest from './suggestions.json'


const Home = () => {
    const { Header, Content } = Layout;
    const { Search } = Input;
    const [keyword, setKeyword] = useState('')
    const [data, setData] = useState()
    const [pageSize, setPageSize] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [applicationModalVisible, setApplicationModalVisible] = useState(false)
    const [application, setApplication] = useState('')
    const [applicationName, setApplicationName] = useState('')
    const [showDetail, setShowDetail] = useState(false)
    const [productUrl, setProductUrl] = useState()

    const [suggestion, setSuggestion] = useState(suggest);
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        }
    ]

    const getData = () => {
        setIsLoading(true)
        axios.get('http://127.0.0.1:9080/crawl.json', {
            params: {
                spider_name: 'first',
                start_requests: true,
                url: `https://polymer-additives.specialchem.com/selectors${application}?q=${keyword}&indexpage=${pageSize}`
            }
        }).then((response) => {
            setData(response.data.items[0])
            setIsLoading(false)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        getData()
    }, [pageSize, application]) // eslint-disable-line



    const dataSource = (data?.products || []).map((ikey, index) => {
        return (

            {
                key: index,
                productName: ikey.productName,
                supplier: ikey.supplier,
                description: ikey.description,
                action: <Button onClick={() => {
                    setProductUrl(ikey.url)
                    setShowDetail(true)
                }}>View Product</Button>
            }

        )
    })

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item >Web Scrapper</Menu.Item>
                </Menu>
            </Header>
            <Loading isLoading={isLoading}>
                <Content style={{ padding: '30px 50px' }}>
                    <div className={styles.SearchContainer}>
                        <AutoComplete
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            } style={{ width: '60%' }}
                            options={suggestion}
                            >
                            <Search
                                placeholder="Please Enter a Keyword"
                                enterButton
                                allowClear
                                onChange={(e) => {
                                    setKeyword(e.target.value)
                                }}
                                onPressEnter={() => {
                                    getData()
                                }}
                                onSearch={() => {
                                    getData()
                                }}
                            />
                        </AutoComplete>


                        <div className={styles.ClearApplications}>
                            {
                                application ? (
                                    <div>
                                        <Button
                                            onClick={() => {
                                                setApplication('')
                                            }}
                                        ><CloseCircleOutlined /> {applicationName}</Button>
                                    </div>
                                ) : null

                            }

                            <div>
                                <Button onClick={() => {
                                    setApplicationModalVisible(true)
                                }}>
                                    <FilterOutlined />
                                </Button>
                            </div>
                            <div>
                                <JsonToExcel
                                    title={<DownloadOutlined />}
                                    data={data?.products}
                                    fileName="Products"
                                    btnClassName={styles.ButtonExcel}
                                />
                            </div>

                        </div>

                    </div>
                    <div>
                        <div style={{ marginTop: '10px' }}>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={{
                                    total: data?.paginate.total, pageSize: (data?.products)?.length, onChange: (e) => {
                                        setPageSize(e)
                                    }
                                }} />
                        </div>
                    </div>
                </Content>
                <Applications modalVisible={applicationModalVisible} setApplicationModalVisible={setApplicationModalVisible} application={application} setApplication={setApplication} setApplicationName={setApplicationName} />
                <ProductDetails url={productUrl} isModalVisible={showDetail} setModalVisible={setShowDetail} />
            </Loading>


        </Layout>
    )
}

export default Home