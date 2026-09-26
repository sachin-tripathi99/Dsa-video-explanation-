class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        for (int x : nums) cnt[x]++;
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> heap;   // (count, key), least frequent on top
        for (auto& [key, c] : cnt) {
            heap.push({c, key});
            if ((int)heap.size() > k) heap.pop();
        }
        vector<int> out;
        while (!heap.empty()) { out.push_back(heap.top().second); heap.pop(); }
        return out;
    }
};
