class Solution {
public:
    string frequencySort(string s) {
        unordered_map<char, int> cnt;
        for (char c : s) cnt[c]++;
        vector<vector<char>> bucket(s.size() + 1);
        for (auto& [ch, c] : cnt) bucket[c].push_back(ch);   // bucket[count]
        string out;
        for (int c = s.size(); c >= 1; c--)
            for (char ch : bucket[c]) out.append(c, ch);
        return out;
    }
};
