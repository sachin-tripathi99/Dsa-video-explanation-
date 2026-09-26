class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        for (int x : nums) cnt[x]++;
        vector<pair<int, int>> v(cnt.begin(), cnt.end());
        sort(v.begin(), v.end(), [](auto& a, auto& b) { return a.second > b.second; });   // most frequent first
        vector<int> out;
        for (int i = 0; i < k; i++) out.push_back(v[i].first);
        return out;
    }
};
