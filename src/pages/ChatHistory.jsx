import styles from './ChatHistory.module.css';
import { use, useEffect, useState } from "react";
import { Search } from 'lucide-react';
import profilePicture from '../assets/profile-picture.webp'
import { set } from 'date-fns';
import { Button } from '@/components/Button';


const mockHistoryChats = [
  {
    id: 1,
    name: "Maria Oliveira",
    messages: [
      { text: "Olá, como vai?", time: new Date(Date.now() - 7200000) }
    ],
  },
  {
    id: 2,
    name: "Carlos Pereira",
    messages: [
      { text: "Poderia me ajudar com...", time: new Date(Date.now() - 3600000) }
    ],
  },
  {
    id: 3,
    name: "São Francisco de Assis",
    messages: [
      { text: "Bom dia, tudo bem??", time: new Date(Date.now() - 3600000) }
    ],
  }
];

export function ChatHistory() {
  //Lista o histórido de chats.
  const [historyChats, setHistoryChats] = useState(mockHistoryChats);
  const [filteredChats, setFilteredChats] = useState(historyChats)


  const [activeView, setActiveView] = useState("list");

  //Mensagens da conversa iniciada.
  const [tempMessages, setTempMessages] = useState([]);

  // Armazena o chat para visualizar posteriormente.
  const [selectedChat, setSelectedChat] = useState(null);


  //Armazena o texto digitado no input de mensagem.

  const [inputMessage, setInputMessage] = useState("");

  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setFilteredChats(historyChats);
  }, [historyChats])

  // Adiciona a mensagem digitada, à nova conversa
  const handleAddMessage = () => {

    const newMessage = {
      text: inputMessage,
      time: new Date(),
    };
    setTempMessages([...tempMessages, newMessage]);
    setInputMessage("");
  };

  // Finaliza a nova conversa e a exibe no histórico
  const handleEndChat = () => {
    if (tempMessages.length > 0) {
      const newChat = {
        id: historyChats.length + 1,
        name: newName,
        messages: tempMessages,
      };
      setHistoryChats(prevChats => [...prevChats, newChat])
    }
    setTempMessages([]);
    setActiveView("list");
    setInputMessage('');
    setNewName('');
  };


  // Quando clica em uma conversa no histórico
  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setActiveView("view");
  };

  // Retorna para o histórico
  const handleReturnToList = () => {
    setActiveView("list");
  };


  function filterChats(chats, query) {
    const searchLowerCase = query.toLowerCase();

    return chats.filter((chat) => (chat.name.toLowerCase().includes(searchLowerCase))
    )
  }

  const handleSearchChat = (e) => {
    const value = e.target.value;

    if (value.length >= 1) {
      setFilteredChats(filterChats(historyChats, value))
    } else {
      setFilteredChats(historyChats)
    }
  }


  // Formulário para preencher o nome do contato, quando clicado no botão de "+ Nova conversa"

  if (isCreatingChat) {
    return (
      <div className={styles.newchat}>
        <input
          type="text"
          placeholder="Nome do contato"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault;
              setActiveView("chat");
              setIsCreatingChat(false);
            }
          }}
        />

        <div className={styles.ChatContainer}>
          <Button
            disabled={!newName.trim()}
            onClick={() => {
              setIsCreatingChat(false);
              setActiveView('chat');
            }}
          >
            {'Iniciar conversa'}
          </Button>
          <div className={styles.iconBackContainer}>
            <Button
              className={styles.backButton}
              onClick={() => {
                setIsCreatingChat(false);
                setNewName('')
              }}
            >
              {<svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>}
              {'Retornar'}
            </Button>
          </div>
        </div>
      </div >
    );

  }

  // Após formulário de contato preenchido, ao clicar em "Iniciar conversa", abre tela de novo chat
  if (activeView === "chat") {
    return (
      <div className={styles.newchat}>
        <div>
          <div className={styles.newMessage}>
            <div className={styles.profile}>
              <img className={styles.profilePicture} src={profilePicture} />
              <span className={styles.contact}>{newName}</span>
            </div>
            {tempMessages.map((msg, index) => (
              <div className={styles.conversation} key={index}>
                <p>{msg.text}</p>
                <span>{msg.time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>

          <textarea
            value={inputMessage}
            placeholder="Digite uma mensagem"
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMessage();
              }
            }}
          />
          <div className={styles.buttonsNewChat}>
            <Button
              disabled={!inputMessage.trim()}
              onClick={handleAddMessage}
            >
              {'Enviar'}
            </Button>
            <Button
              className={styles.backButton}
              onClick={handleEndChat}
            >
              {<svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>}
              {'Retornar'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de visualização de uma conversa listada no histórico
  if (activeView === "view" && selectedChat) {
    return (
      <div className={styles.newchat}>
        <div className={styles.viewProfileChats}>
          <img className={styles.profilePicture} src={profilePicture} />
          <h2>{selectedChat.name}</h2>
        </div>

        <div className={styles.viewChatContainer}>
          <div >
            {selectedChat.messages.map((msg, index) => (
              <div className={styles.conversation} key={index}>
                <p>{msg.text}</p>
                <span>{msg.time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
          <button className={styles.backButton} onClick={handleReturnToList}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retornar ao histórico
          </button>
        </div >
      </div >
    );
  }

  // Tela de histórico de chats
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Empresa ABC</span>
        <span>[Saldo: R$50]</span>
      </div>

      <div className={styles.search}>
        <Search size={14} />
        <input
          className={styles.searchChat}
          type="text"
          onChange={handleSearchChat}
          placeholder='Buscar...'
        />
      </div>

      <div className={styles.chatList}>
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleOpenChat(chat)}
          >
            <div className={styles.message}>
              <div>
                <div className={styles.infoProfile}>
                  <img className={styles.profilePicture} src={profilePicture} alt="Foto de perfil" />
                  <p>{chat.name}</p>
                </div>
                <p>{chat.messages[chat.messages.length - 1].text}</p>
              </div>
              <div>
                {chat.messages[chat.messages.length - 1].time.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <Button onClick={() => setIsCreatingChat(true)}>
          {'[+ Nova Conversa]'}
        </Button>
      </div>
    </div>
  );
}
