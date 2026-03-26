import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@src/components/ui/tabs"
import { BsBagPlusFill } from 'react-icons/bs'

const Info = () => {
  return (
    <Tabs defaultValue="cum-comand" className="!flex items-start mt-8 px-4 relative">
        <TabsList className="flex flex-col w-1/4 h-full">
            <TabsTrigger value="cum-comand" className="w-full text-2xl text-[var(--color-primary)] cursor-pointer" >Cum comand?</TabsTrigger>
            <TabsTrigger value="livrare-produse" className="w-full text-2xl text-[var(--color-primary)] cursor-pointer">Livrare produse</TabsTrigger>
            <TabsTrigger value="politica-de-retur" className="w-full text-2xl text-[var(--color-primary)] cursor-pointer">Politica de retur</TabsTrigger>
            <TabsTrigger value="termeni-conditii" className="w-full text-2xl text-[var(--color-primary)] cursor-pointer">Termeni si conditii</TabsTrigger>
            <TabsTrigger value="cookies" className="w-full text-2xl text-[var(--color-primary)] cursor-pointer">Cookies</TabsTrigger>
        </TabsList>
        <div className='flex-3/4'>
            <TabsContent value="cum-comand" className="flex-col bg-[var(--color-primary)] rounded-2xl text-xl text-white font-semibold px-12 py-12 min-h-[60vh]">
                <h1 className='w-full text-4xl mb-6'>Cum comand?</h1>
                <ol className='list-decimal'>
                    <li>
                        <p>Selectarea cărții</p>
                        <ul className='list-disc px-4'>
                            <li>Răsfoiește catalogul nostru online și alege cartea dorită.</li>
                            <li>Fiecare carte are informații complete: format (tipărit / ebook), preț, disponibilitate.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Adăugarea în coș</p>
                        <ul className='list-disc px-4'>
                            <li>
                                <div className='flex items-baseline gap-2'>
                                    Apasă butonul <BsBagPlusFill /> pentru fiecare titlu dorit.
                                </div>
                            </li>
                            <li>Poți modifica cantitatea sau elimina titluri înainte de finalizarea comenzii.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Crearea contului sau completarea datelor</p>
                        <ul className='list-disc px-4'>
                            <li>Poți crea un cont pentru urmărirea comenzilor sau să comanzi ca invitat.</li>
                            <li>Completează datele de livrare și facturare corecte: nume, adresă, e-mail și telefon.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Alegerea metodei de plată</p>
                        <ul className='list-disc px-4'>
                            <li>SolarisTales S.R.L. acceptă diverse metode de plată: card bancar, transfer bancar sau plata la livrare</li>
                            <li>Toate plățile sunt securizate cu Stripe.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Confirmarea comenzii</p>
                        <ul className='list-disc px-4'>
                            <li>După finalizarea formularului și efectuarea plății, vei primi un e-mail de confirmare cu detaliile comenzii și estimarea livrării.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Livrarea</p>
                        <ul className='list-disc px-4'>
                            <li>Cărțile tipărite vor fi expediate prin curier la adresa indicată.</li>
                            <li>Ebook-urile vor fi trimise prin e-mail sau disponibile pentru descărcare imediat după confirmarea plății.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Politica de retur</p>
                        <ul className='list-disc px-4'>
                            <li>Cititorii pot solicita retur conform legislației în vigoare pentru bunurile livrate, în termenul legal, dacă sunt respectate condițiile de integritate a produsului.</li>
                        </ul>
                    </li>
                </ol>
            </TabsContent>
            <TabsContent value="livrare-produse" className="flex-col bg-[var(--color-primary)] rounded-2xl text-xl text-white font-semibold px-12 py-12 min-h-[60vh]">
                <h1 className='w-full text-4xl mb-6'>Livrare produse</h1>
                <span>Livrare produse – SolarisTales S.R.L.</span>
                <ol className='list-decimal'>
                    <li>
                        <p>Modalități de livrare</p>
                        <ul className='list-disc px-4'>
                            <li>Curier rapid – pentru cărțile tipărite, livrarea se face prin firme de curierat partenere, direct la adresa indicată de cititor.</li>
                            <li>Descărcare digitală – pentru ebook-uri, livrarea se face imediat după confirmarea plății, prin e-mail sau link securizat pentru descărcare.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Termene de livrare</p>
                        <ul className='list-disc px-4'>
                            <li>Cărțile tipărite sunt expediate în termen de 2–5 zile lucrătoare de la confirmarea comenzii și a plății.</li>
                            <li>Ebook-urile sunt disponibile imediat după confirmarea plății.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Costuri de livrare</p>
                        <ul className='list-disc px-4'>
                            <li>Taxa de livrare pentru cărțile tipărite este afișată clar în pagina de checkout și poate varia în funcție de greutate și destinație.</li>
                            <li>Ebook-urile nu au cost suplimentar de livrare.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Urmărirea comenzii</p>
                        <ul className='list-disc px-4'>
                            <li>Cititorii primesc un cod de urmărire (tracking number) pentru comenzile livrate prin curier, pentru a putea monitoriza statusul expedierii.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Livrare în afara României</p>
                        <ul className='list-disc px-4'>
                            <li>În prezent, livrarea fizică se face doar pe teritoriul României.</li>
                            <li>Pentru ebook-uri, livrarea este disponibilă internațional, prin e-mail sau link de descărcare.</li>
                        </ul>
                    </li>
                </ol>
            </TabsContent>
            <TabsContent value="politica-de-retur" className="flex-col bg-[var(--color-primary)] rounded-2xl text-xl text-white font-semibold px-12 py-12 min-h-[60vh]">
                <h1 className='w-full text-4xl mb-6'>Politica si retur</h1>
                <ol className='list-decimal'>
                    <li>
                        <p>Dreptul de retur</p>
                        <p>Conform legislației în vigoare, cititorii au dreptul să returneze produsele achiziționate online în termen de 14 zile calendaristice de la primirea acestora, fără a fi nevoie să motiveze decizia.</p>
                    </li>
                    <li>
                        <p>Condiții pentru retur</p>
                        <ul className='list-disc px-4'>
                            <li>Cartea tipărită trebuie să fie neutilizată și în ambalajul original, fără deteriorări.</li>
                            <li>Ebook-urile nu pot fi returnate după descărcare, conform reglementărilor legale privind bunurile digitale.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Procedura de retur</p>
                        <ol className='list-decimal px-4'>
                            <li>Trimite un e-mail la adresa oficială a editurii indicând comanda și motivul returului.</li>
                            <li>Ambalează produsul corespunzător și trimite-l înapoi prin curier, la adresa indicată de SolarisTales S.R.L.</li>
                            <li>După recepționarea și verificarea produsului, suma plătită va fi rambursată în termen de 14 zile calendaristice, prin aceeași metodă folosită la plata comenzii.</li>
                        </ol>
                    </li>
                    <li>
                        <p>Costurile returului</p>
                        <p>Costurile transportului pentru retur sunt în sarcina cititorului, cu excepția cazului în care produsul este livrat greșit sau defectuos.</p>
                    </li>
                    <li>
                        <p>Excepții</p>
                        <ul className='list-disc px-4'>
                            <li>Produsele personalizate sau modificate la cererea cititorului nu pot fi returnate.</li>
                            <li>Ebook-urile, odată descărcate, nu pot fi returnate.</li>
                        </ul>
                    </li>
                </ol>
            </TabsContent>
            <TabsContent value="termeni-conditii" className="flex-col bg-[var(--color-primary)] rounded-2xl text-xl text-white font-semibold px-12 py-12 min-h-[60vh]">
                <h1 className='w-full text-4xl mb-6'>Termeni si conditii</h1>
                <ol className='list-decimal'>
                    <li>
                        <p>Informatii generale</p>
                        <p>Prezentele Termeni și condiții reglementează utilizarea site-ului SolarisTales S.R.L., precum și procedura de achiziție a cărților tipărite și digitale. Prin accesarea site-ului și plasarea unei comenzi, cititorul acceptă aceste Termeni și condiții.</p>
                    </li>
                    <li>
                        <p>Comenzi</p>
                        <ul className='list-disc px-4'>
                            <li>Cititorul poate plasa comenzi prin site, selectând produsele dorite și completând formularul cu datele necesare.</li>
                            <li>După finalizarea comenzii, cititorul primește un e-mail de confirmare cu detaliile achiziției.</li>
                            <li>SolarisTales S.R.L. își rezervă dreptul de a refuza o comandă în cazuri justificate (produse epuizate, date incomplete sau suspecte de fraudă).</li>
                        </ul>
                    </li>
                    <li>
                        <p>Prețuri și plată</p>
                        <ul className='list-disc px-4'>
                            <li>Toate prețurile afișate pe site sunt exprimate în RON și includ TVA.</li>
                            <li>Metodele de plată disponibile: card bancar, transfer bancar sau plata la livrare (dacă este disponibilă).</li>
                            <li>Plata trebuie efectuată integral pentru ca comanda să fie procesată și livrată.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Livrare</p>
                        <ul className='list-disc px-4'>
                            <li>Cărțile tipărite sunt livrate prin curier rapid, în termen de 2–5 zile lucrătoare, la adresa indicată de cititor.</li>
                            <li>Ebook-urile sunt livrate imediat după confirmarea plății, prin e-mail sau link securizat de descărcare.</li>
                            <li>Livrarea se face în România pentru tipărituri; ebook-urile pot fi livrate internațional.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Politica de retur</p>
                        <ul className='list-disc px-4'>
                            <li>Cititorii pot returna produsele tipărite în termen de 14 zile calendaristice de la primirea acestora, dacă acestea sunt neutilizate și în ambalajul original.</li>
                            <li>Ebook-urile descărcate nu pot fi returnate.</li>
                            <li>Pentru retur, cititorul trebuie să contacteze SolarisTales S.R.L. și să urmeze procedura indicată.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Responsabilități</p>
                        <ul className='list-disc px-4'>
                            <li>SolarisTales S.R.L. nu răspunde pentru eventuale întârzieri cauzate de curier sau de situații externe necontrolabile.</li>
                            <li>Cititorul este responsabil pentru completarea corectă a datelor de livrare și contact.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Protecția datelor</p>
                        <ul className='list-disc px-4'>
                            <li>Datele personale colectate prin site sunt prelucrate conform Politicii de confidențialitate și GDPR.</li>
                            <li>Cititorul trebuie să își exprime consimțământul pentru prelucrarea datelor prin checkbox la plasarea comenzii.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Legea aplicabilă</p>
                        <ul className='list-disc px-4'>
                            <li>Prezentele Termeni și condiții sunt guvernate de legea română.</li>
                            <li>Orice litigiu va fi soluționat pe cale amiabilă, iar în caz contrar, de instanțele competente din România.</li>
                        </ul>
                    </li>
                </ol>
                <hr className="w-full border-1 border-gray-200 my-6" />

                <h1 className='w-full text-4xl mb-6'>Termeni si conditii - Autor</h1>
                <span>
                    Acceptarea prelucrării datelor cu caracter personal
Prin transmiterea manuscrisului sau a oricărei informații către Editura SolarisTales S.R.L., Autorul își exprimă acordul explicit și necondiționat pentru prelucrarea datelor sale cu caracter personal, în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația română aplicabilă.
                </span>
                <ol className='list-decimal'>
                     <li>
                        <p>Date colectate</p>
                        <p>Editura poate colecta următoarele date cu caracter personal:</p>
                        <ul className='list-disc px-4'>
                            <li>Nume și prenume;</li>
                            <li>Adresă de e-mail;</li>
                            <li>Număr de telefon;</li>
                            <li>Adresă poștală;</li>
                            <li>Informații referitoare la manuscrise, publicații și lucrări transmise;</li>
                            <li>Alte date relevante pentru procesul de evaluare și publicare.</li>
                        </ul>
                    </li>
                     <li>
                        <p>Scopul prelucrării</p>
                        <p>Datele vor fi prelucrate în scopuri strict legate de:</p>
                        <ul className='list-disc px-4'>
                            <li>evaluarea manuscriselor;</li>
                            <li>comunicarea cu Autorul;</li>
                            <li>procesul de publicare și comercializare a operelor;</li>
                            <li> respectarea obligațiilor legale ale Editurii.</li>
                        </ul>
                    </li>
                     <li>
                        <p>Durata prelucrării</p>
                        <p>Datele vor fi păstrate pe durata colaborării și pentru o perioadă suplimentară necesară respectării obligațiilor legale sau contabile ale Editurii.</p>
                    </li>
                     <li>
                        <p>Drepturile Autorului</p>
                        <p>Autorul are următoarele drepturi:</p>
                        <ul className='list-disc px-4'>
                            <li>acces la datele personale;</li>
                            <li>rectificarea datelor incorecte sau incomplete;</li>
                            <li>ștergerea datelor (cu excepția celor necesare pentru obligații legale);</li>
                            <li>restricționarea prelucrării;</li>
                            <li>opoziție la prelucrare;</li>
                            <li>portabilitatea datelor.</li>
                        </ul>
                        <p>Pentru exercitarea drepturilor, Autorul poate contacta Editura prin e-mail la adresa oficială comunicată pe site.</p>
                    </li>
                    <li>
                        <p>Divulgarea datelor</p>
                        <p>Datele Autorului nu vor fi divulgate unor terți fără consimțământ, cu excepția situațiilor prevăzute de lege.</p>
                    </li>
                    <li>
                        <p>Securitatea datelor</p>
                        <p>Editura implementează măsuri tehnice și organizatorice adecvate pentru a proteja datele cu caracter personal împotriva accesului neautorizat, pierderii sau distrugerii.</p>
                    </li>
                    <li>
                        <p>Acceptarea prelucrării</p>
                        <p>Prin transmiterea manuscrisului sau a informațiilor solicitate, Autorul confirmă că a citit, înțeles și acceptat această politică de prelucrare a datelor cu caracter personal.</p>
                    </li>
                </ol>
            </TabsContent>
            <TabsContent value="cookies" className="flex- bg-[var(--color-primary)] rounded-2xl text-xl text-white font-semibold px-12 py-12 min-h-[60vh]">
                <h1 className='w-full text-4xl mb-6'>Cookies</h1>
                <ol className='list-decimal'>
                    <li>
                        <p>Ce sunt cookie-urile</p>
                        <p>Cookie-urile sunt fișiere mici stocate pe dispozitivul tău atunci când accesezi site-ul nostru. Ele ne ajută să îmbunătățim experiența utilizatorului, să analizăm traficul și să personalizăm conținutul.</p>
                    </li>
                    <li>
                        <p>Tipuri de cookie-uri utilizate</p>
                        <ul className='list-disc px-4'>
                            <li>Cookie-uri strict necesare: esențiale pentru funcționarea site-ului (ex. coșul de cumpărături, autentificarea).</li>
                            <li>Cookie-uri de performanță: ne permit să analizăm modul în care vizitatorii folosesc site-ul pentru a-l îmbunătăți.</li>
                            <li>Cookie-uri de marketing și publicitate: pentru afișarea de reclame relevante și personalizate.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Consimțământul utilizatorului</p>
                        <ul className='list-disc px-4'>
                            <li>La prima accesare a site-ului, vizitatorului i se va solicita consimțământul pentru utilizarea cookie-urilor, conform legislației GDPR.</li>
                            <li>Utilizatorul poate accepta toate cookie-urile sau poate gestiona preferințele din setările site-ului.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Gestionarea și ștergerea cookie-urilor</p>
                        <ul className='list-disc px-4'>
                            <li>Cookie-urile pot fi gestionate sau șterse prin setările browser-ului.</li>
                            <li>Reține că dezactivarea unor cookie-uri poate afecta funcționalitatea anumitor secțiuni ale site-ului, inclusiv procesul de comandă și livrare.</li>
                        </ul>
                    </li>
                    <li>
                        <p>Modificări</p>
                        <span>SolarisTales S.R.L. își rezervă dreptul de a actualiza politica de cookie-uri. Versiunea actualizată va fi afișată pe site.</span>
                    </li>
                </ol>
            </TabsContent>
        </div>
    </Tabs>
  )
}

export default Info