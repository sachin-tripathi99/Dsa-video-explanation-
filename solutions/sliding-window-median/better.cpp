class Solution {
public:
    vector<double> medianSlidingWindow(vector<int>& nums, int k) {
        vector<int> w(nums.begin(), nums.begin() + k);
        sort(w.begin(), w.end());                            // window kept sorted
        vector<double> out;
        for (size_t i = 0; ; i++) {
            out.push_back(k % 2 ? w[k / 2] : ((double)w[k / 2 - 1] + w[k / 2]) / 2);
            if (i + k == nums.size()) break;
            w.erase(lower_bound(w.begin(), w.end(), nums[i]));                  // outgoing
            w.insert(lower_bound(w.begin(), w.end(), nums[i + k]), nums[i + k]); // incoming
        }
        return out;
    }
};
