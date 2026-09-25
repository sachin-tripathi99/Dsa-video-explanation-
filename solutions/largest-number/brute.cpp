class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> s;
        for (int x : nums) s.push_back(to_string(x));
        sort(s.begin(), s.end());
        string best;
        do {
            string joined;
            for (auto& t : s) joined += t;
            best = max(best, joined);          // same length → string compare
        } while (next_permutation(s.begin(), s.end()));
        return best[0] == '0' ? "0" : best;
    }
};
