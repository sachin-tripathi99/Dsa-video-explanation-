class Solution {
public:
    vector<int> smallestRange(vector<vector<int>>& nums) {
        vector<int> starts, best;
        for (auto& l : nums) starts.insert(starts.end(), l.begin(), l.end());
        sort(starts.begin(), starts.end());
        for (int lo : starts) {
            long long hi = LLONG_MIN;
            for (auto& l : nums) {
                size_t i = 0;
                while (i < l.size() && l[i] < lo) i++;               // first element ≥ lo
                if (i == l.size()) return best;
                hi = max(hi, (long long)l[i]);
            }
            if (best.empty() || hi - lo < (long long)best[1] - best[0]) best = {lo, (int)hi};
        }
        return best;
    }
};
