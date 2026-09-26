class Solution {
public:
    vector<string> topKFrequent(vector<string>& words, int k) {
        unordered_map<string, int> cnt;
        for (auto& w : words) cnt[w]++;
        // "better" comparator: the heap's top is the worst candidate
        auto better = [&](const string& a, const string& b) { return cnt[a] != cnt[b] ? cnt[a] > cnt[b] : a < b; };
        priority_queue<string, vector<string>, decltype(better)> heap(better);
        for (auto& [w, c] : cnt) {
            heap.push(w);
            if ((int)heap.size() > k) heap.pop();
        }
        vector<string> out;
        while (!heap.empty()) { out.push_back(heap.top()); heap.pop(); }
        reverse(out.begin(), out.end());                     // worst → best, so reverse
        return out;
    }
};
