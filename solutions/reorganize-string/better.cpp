class Solution {
public:
    string reorganizeString(string s) {
        int cnt[26] = {0};
        for (char c : s) cnt[c - 'a']++;
        priority_queue<pair<int, char>> heap;                // (count, char)
        for (int c = 0; c < 26; c++) if (cnt[c]) heap.push({cnt[c], 'a' + c});
        string out;
        while (!heap.empty()) {
            auto first = heap.top(); heap.pop();
            if (!out.empty() && out.back() == first.second) {
                if (heap.empty()) return "";                 // only the previous char is left
                auto second = heap.top(); heap.pop();
                out.push_back(second.second);
                if (--second.first > 0) heap.push(second);
                heap.push(first);
            } else {
                out.push_back(first.second);
                if (--first.first > 0) heap.push(first);
            }
        }
        return out;
    }
};
