class Solution {
public:
    string removeKdigits(string num, int k) {
        string st;                                           // increasing stack
        for (char c : num) {
            while (k > 0 && !st.empty() && st.back() > c) { st.pop_back(); k--; }   // remove a peak
            st.push_back(c);
        }
        st.resize(st.size() - k);                            // leftover removals from the end
        size_t z = st.find_first_not_of('0');
        return z == string::npos ? "0" : st.substr(z);
    }
};
