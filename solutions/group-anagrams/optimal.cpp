class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (auto& w : strs) {
            string key(26, 0);
            for (char c : w) key[c - 'a']++;                     // counts packed in a string
            groups[key].push_back(w);
        }
        vector<vector<string>> out;
        for (auto& [k, g] : groups) out.push_back(g);
        return out;
    }
};
