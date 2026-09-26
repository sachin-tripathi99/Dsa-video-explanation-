class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        vector<vector<int>> all;
        for (int x : nums1) for (int y : nums2) all.push_back({x, y});
        stable_sort(all.begin(), all.end(), [](auto& p, auto& q) { return p[0] + p[1] < q[0] + q[1]; });
        all.resize(k);
        return all;
    }
};
