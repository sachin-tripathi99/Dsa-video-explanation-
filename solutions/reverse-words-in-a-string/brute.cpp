class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        vector<string> words;
        string w;
        while (ss >> w) words.push_back(w);
        reverse(words.begin(), words.end());
        string out;
        for (size_t i = 0; i < words.size(); i++) {
            if (i) out += ' ';
            out += words[i];
        }
        return out;
    }
};
