class Solution {
    struct Node { Node* next[26] = {}; bool end = false; };
public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        Node* root = new Node();
        for (auto& d : dictionary) {
            Node* cur = root;
            for (char ch : d) {
                if (!cur->next[ch - 'a']) cur->next[ch - 'a'] = new Node();
                cur = cur->next[ch - 'a'];
            }
            cur->end = true;
        }
        stringstream ss(sentence);
        string w, out;
        while (ss >> w) {
            Node* cur = root;
            int i = 0;
            while (i < (int)w.size() && cur->next[w[i] - 'a'] && !cur->end) cur = cur->next[w[i++] - 'a'];
            if (!out.empty()) out += ' ';
            out += cur->end ? w.substr(0, i) : w;           // first ✓ on the walk
        }
        return out;
    }
};
