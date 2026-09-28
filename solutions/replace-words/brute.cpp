class Solution {
public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        unordered_set<string> roots(dictionary.begin(), dictionary.end());
        stringstream ss(sentence);
        string w, out;
        while (ss >> w) {
            for (int i = 1; i <= (int)w.size(); i++)        // shortest prefix first
                if (roots.count(w.substr(0, i))) { w = w.substr(0, i); break; }
            if (!out.empty()) out += ' ';
            out += w;
        }
        return out;
    }
};
