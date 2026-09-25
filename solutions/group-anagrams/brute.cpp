class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        vector<vector<string>> groups;
        vector<string> keys;                                 // sorted form of each group's first word
        for (auto& w : strs) {
            string s = w;
            sort(s.begin(), s.end());
            int found = -1;
            for (int g = 0; g < (int)keys.size(); g++) if (keys[g] == s) { found = g; break; }
            if (found == -1) { keys.push_back(s); groups.push_back({}); found = groups.size() - 1; }
            groups[found].push_back(w);
        }
        return groups;
    }
};
