import { useState } from 'react';
import { useFindUserDetails } from './business-logic/SearchDetailsHook';
import { FileUploader } from "./components";
import { UserDetailsList } from './components/UserDetailsList';
import { SearchInput } from './types/types';

function App() {

  const [searchInputs, setSearchInputs] = useState<SearchInput[]>([]);

  const { userDetails } = useFindUserDetails(searchInputs);

  return (
    <div className="user-search-page">
      <div>
        <FileUploader onChange={setSearchInputs} />
      </div>
      <div style={{ marginTop: 32 }}>
        <UserDetailsList details={userDetails}/>
      </div>
    </div>
  );
}

export default App;
