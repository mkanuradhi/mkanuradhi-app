import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"

export const NotFound = () => {

  return (
    <>
      <Container>
        <div>
          <h1>Not Found</h1>
          <h3>404</h3>
          <p>Oops! The page you&apos;re looking for doesn&apos;t seem to exist. Try going back to our <Link to="/">homepage</Link> or checking the URL.</p>
        </div>
      </Container>
    </>
  )
}
