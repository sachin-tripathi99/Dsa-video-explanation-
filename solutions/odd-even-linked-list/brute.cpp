class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        vector<int> odd, even;
        int pos = 1;
        for (ListNode* c = head; c; c = c->next, pos++) (pos % 2 ? odd : even).push_back(c->val);
        odd.insert(odd.end(), even.begin(), even.end());
        ListNode dummy;
        ListNode* tail = &dummy;
        for (int x : odd) { tail->next = new ListNode(x); tail = tail->next; }
        return dummy.next;
    }
};
