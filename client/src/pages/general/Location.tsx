import Cookies from "js-cookie";
import { useFetchLocationQuery } from "../../store";
import React, { useState } from 'react';
import { useNavigate } from "react-router";

function Location() {
    const navigate = useNavigate();
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('');
    const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
    const [filteredSubdistricts, setFilteredSubdistricts] = useState<string[]>([]);

    const { data, isFetching, error } = useFetchLocationQuery("");

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedProvince = event.target.value;
      setSelectedProvince(selectedProvince);
      setSelectedDistrict('');
      const filteredDistricts = data?.districts?.filter((district:any) =>
        district?.provinces?.nameInThai?.startsWith(selectedProvince)
      );
      
      setFilteredDistricts(filteredDistricts);
      setFilteredSubdistricts([]);
    };
    
    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedDistrict = event.target.value;
      setSelectedDistrict(selectedDistrict);
      
      const filteredSubdistricts = data?.subdistricts?.filter((subdistrict:any) =>
        subdistrict?.districts?.nameInThai?.startsWith(selectedDistrict)
      );
      
      setFilteredSubdistricts(filteredSubdistricts);
    };

    const handleSubDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSubDistrict = event.target.value;
      setSelectedSubDistrict(selectedSubDistrict);
    }

    const handleClick = () => {
      Cookies.set('location', JSON.stringify({
        selectedProvince,
        selectedDistrict,
        selectedSubDistrict
      }));
      navigate('/')
    }

    return ( 
        <div>
        <main className="grid place-items-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="kanit mt-4 block px-6 py-10 bg-white border border-gray-200 rounded-xl shadow-md">
              <div className="flex flex-col mb-4">
                <p className="text-4xl font-semibold">ยินดีต้อนรับ</p>
                <p className="text-lg mt-2">เลือกตำแหน่งใกล้คุณ</p>
              </div>
              <div className="flex mb-6">
                <select 
                  onChange={handleProvinceChange}
                  disabled={isFetching}
                  className="p-2 border-2 mr-3"
                >
                  <option value="">เลือกจังหวัด</option>
                  {data?.provinces?.map((province:any, index:number) => (
                    <option key={index} value={province?.nameInThai}>
                      {province?.nameInThai}
                    </option>
                  ))}
                </select>
                
                <select 
                  onChange={handleDistrictChange}
                  disabled={selectedProvince === ''}
                  className="p-2 border-2 mr-3"
                >
                  <option value="">เลือกเขต</option>
                  {filteredDistricts?.map((district:any, index) => (
                    <option key={index} value={district?.nameInThai}>
                      {district?.nameInThai}
                    </option>
                  ))}
                </select>

                <select
                  disabled={selectedDistrict === ''}
                  onChange={handleSubDistrictChange}
                  className="p-2 border-2"
                >
                  <option value="">เลือกแขวง</option>
                  {filteredSubdistricts?.map((subdistrict:any, index) => (
                    <option key={index} value={subdistrict?.nameInThai}>
                      {subdistrict?.nameInThai}
                    </option>
                  ))}
                </select>
              </div>
              { selectedDistrict && selectedProvince && selectedSubDistrict ?
                <div className="text-white bg-red-500 flex justify-center rounded-xl py-3 cursor-pointer" onClick={handleClick}>ค้นหา</div>
              :
                <div className="text-white bg-gray-400 flex justify-center rounded-xl py-3 cursor-not-allowed">ค้นหา</div>}
            </div>
        </main>
      </div>
     );
}

export default Location;