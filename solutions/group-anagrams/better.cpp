class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (auto& w : strs) {
            string key = w;
            sort(key.begin(), key.end());                      // canonical form
            groups[key].push_back(w);
        }
        vector<vector<string>> out;
        for (auto& [k, g] : groups) out.push_back(g);
        return out;
    }
};
