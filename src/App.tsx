import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import NavigationBar from "./components/NavigationBar";
import { useTranslation } from "react-i18next";
import useTitleUpdater from "./hooks/useTitleUpdater";
import useLanguage from "./hooks/useLanguage";

function App() {
  useTitleUpdater();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  return (
    <>
      <div className='app' lang={language}>
        <nav>
          <NavigationBar changeLanguage={changeLanguage} currentLanguage={language} />
        </nav>
        <Container>
          <header>
            <h1>{t('title')}</h1>
          </header>
          <main>
            <Button variant="danger">Danger Button</Button>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sagittis finibus lorem eu dignissim. Sed porttitor urna eu sapien suscipit, et varius odio blandit. Duis a metus risus. Mauris ut elit ligula. Proin ornare tincidunt nulla, at dignissim ex sollicitudin vel. Mauris bibendum tristique nisi, sed ultricies mauris ullamcorper et. Cras pellentesque id ex aliquam ullamcorper. Integer consectetur vulputate risus. Morbi eget erat blandit, iaculis tortor nec, tincidunt lorem. Aliquam dui tellus, pellentesque placerat aliquam vitae, congue a purus. Vivamus nunc massa, volutpat quis nisi nec, sagittis scelerisque arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            <p>Morbi consectetur sapien ac purus hendrerit pulvinar. Nulla facilisi. Curabitur sodales enim at consectetur rutrum. Curabitur semper nisi a nulla volutpat fermentum. Cras mollis auctor nulla in fringilla. Nam rhoncus sodales nisl, vel rutrum nunc. Maecenas sed quam leo. Aenean volutpat augue ut rutrum rutrum. Mauris blandit nisi non pharetra aliquam. Donec iaculis ullamcorper erat at fermentum. Vivamus commodo nisl dui, vitae lacinia enim ullamcorper eu.</p>
            <p>Maecenas dignissim blandit risus at eleifend. Ut bibendum turpis turpis, eu commodo diam ullamcorper at. Donec pharetra dapibus odio. Suspendisse accumsan, lorem ac cursus mollis, lorem dolor pulvinar mauris, sed dictum massa nunc facilisis lacus. Aenean congue sem vitae turpis aliquam sollicitudin. Vivamus consectetur libero nec aliquam luctus. Nullam arcu purus, scelerisque iaculis sollicitudin porta, vestibulum ut lorem. Maecenas tristique porta eros id posuere.</p>
            <p>Fusce sapien nunc, euismod et tempor sed, blandit a purus. Pellentesque dignissim fringilla elit, vel placerat enim efficitur ut. Quisque ut eleifend odio. Sed cursus facilisis nisi sed rutrum. Vestibulum pharetra scelerisque finibus. Praesent quis efficitur erat, in lobortis ipsum. Proin vitae ultrices velit, et feugiat enim. Duis ornare turpis a massa consequat, sit amet bibendum sapien viverra. Etiam purus libero, porttitor nec semper vel, ullamcorper ac felis. Praesent magna orci, dictum sit amet tortor aliquet, consectetur aliquam justo. Etiam non nisi vel nisi dictum pharetra. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque in feugiat nibh. Etiam dignissim sem sit amet nibh ullamcorper fringilla. Quisque fringilla nibh dui, at pretium velit maximus sed.</p>
            <p>Nunc magna odio, dictum non ornare sed, efficitur id sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas euismod, ligula id lobortis consectetur, ipsum felis venenatis felis, in ullamcorper orci magna vitae mauris. Proin id dui leo. Sed vulputate hendrerit massa at venenatis. Maecenas ut eros in eros ullamcorper feugiat iaculis vitae odio. Phasellus ut mattis justo. Morbi metus velit, rhoncus vel luctus faucibus, facilisis nec metus. Curabitur sollicitudin in orci in molestie. Quisque et sapien in ante eleifend accumsan.</p>
            <p>Nulla facilisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt tincidunt justo aliquam gravida. Vivamus ultrices diam et urna varius ultricies. Donec placerat tortor sit amet diam facilisis pulvinar. Sed dui dolor, vestibulum nec nisl a, consequat ullamcorper dolor. Donec lectus augue, scelerisque sed dapibus dapibus, molestie nec nunc. Aliquam rhoncus convallis rhoncus. Mauris vestibulum tortor sit amet lacus consectetur, ut dictum dui eleifend. Nulla mattis molestie nisl, eu cursus lectus porta nec.</p>
            <p>Vestibulum posuere at ipsum eget interdum. Proin tempor congue magna, sed placerat libero tincidunt at. Pellentesque sit amet blandit ligula, eget venenatis lectus. Maecenas suscipit velit vel risus molestie auctor. Maecenas consequat eros ullamcorper nisi eleifend, non tincidunt nibh vehicula. Praesent ac urna ultrices, dapibus sapien quis, vulputate arcu. Sed non rhoncus nunc, vitae hendrerit massa. Mauris at tincidunt sem. Vestibulum condimentum nunc interdum lacinia consequat. Suspendisse potenti.</p>
            <p>Nullam lorem justo, varius lobortis rhoncus et, tempus in metus. Mauris tristique ligula tellus. Sed dui sem, ullamcorper vel metus vel, blandit mattis tortor. Cras porttitor rutrum magna, eu rhoncus mauris porta in. Donec a posuere augue. Ut viverra ante id porta ullamcorper. Donec arcu odio, rutrum in pellentesque non, mattis eu risus. Vestibulum sit amet accumsan enim, a dictum velit. Ut eu euismod augue. Suspendisse ullamcorper imperdiet ligula, id tristique lacus maximus ac. Integer enim neque, pharetra a suscipit vitae, dignissim luctus mauris. Vivamus pretium auctor interdum. Nam non dolor nec neque euismod ornare. Sed sit amet lorem fermentum, porttitor nulla sodales, facilisis metus. Pellentesque congue purus et rutrum dictum. Donec eget lorem non nisi aliquet euismod.</p>
          </main>
        </Container>
      </div>
    </>
  )
}

export default App
