import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getTotalPages } from './utils';

const Pagination = (props) => {
    const { totalResults, setPaginatedData, currentPage } = props;
    const totalPages = getTotalPages(totalResults);
    const pages = [];

    for(let i = 1; i <= totalPages; i++) {
        pages.push(
        <Col key={i}>
            <Button 
                variant={currentPage === i ? "primary" : "secondary"}
                onClick={() => setPaginatedData(i)}
            >
                {i}
            </Button>
        </Col>)   
    }

    return (
        <div className="page-btn-nav">
            <Row> {pages} </Row>
        </div>
    )
}

export default Pagination;