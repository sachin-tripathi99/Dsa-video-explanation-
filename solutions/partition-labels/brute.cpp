class Solution {
public:
    vector<int> partitionLabels(string s) {
        vector<int> out;
        int n = s.size(), start = 0;
        while (start < n) {
            int end = start;
            for (int i = start; i <= end; i++)              // every char inside the part
                for (int j = n - 1; j > end; j--)           // later copies push the end
                    if (s[j] == s[i]) { end = j; break; }
            out.push_back(end - start + 1);
            start = end + 1;
        }
        return out;
    }
};
