class Solution {
public:
    vector<double> medianSlidingWindow(vector<int>& nums, int k) {
        vector<double> out;
        for (size_t i = 0; i + k <= nums.size(); i++) {
            vector<int> w(nums.begin() + i, nums.begin() + i + k);
            sort(w.begin(), w.end());
            out.push_back(k % 2 ? w[k / 2] : ((double)w[k / 2 - 1] + w[k / 2]) / 2);
        }
        return out;
    }
};
