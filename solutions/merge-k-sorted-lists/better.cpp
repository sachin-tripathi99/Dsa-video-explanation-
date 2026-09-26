class Solution {
    ListNode* mergeTwo(ListNode* a, ListNode* b) {
        ListNode dummy(0), *tail = &dummy;
        while (a && b) {
            if (a->val <= b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = a ? a : b;
        return dummy.next;
    }
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode* result = nullptr;
        for (ListNode* l : lists) result = mergeTwo(result, l);
        return result;
    }
};
