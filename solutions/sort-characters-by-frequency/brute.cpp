class Solution {
public:
    string frequencySort(string s) {
        unordered_map<char, int> cnt;
        for (char c : s) cnt[c]++;
        sort(s.begin(), s.end(), [&](char a, char b) { return cnt[a] != cnt[b] ? cnt[a] > cnt[b] : a < b; });
        return s;
    }
};
