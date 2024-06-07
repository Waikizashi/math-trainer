package com.stuba.mathtrainerapi.init;

import com.stuba.mathtrainerapi.entity.Practice;
import com.stuba.mathtrainerapi.entity.PracticeContent;
import com.stuba.mathtrainerapi.entity.PossibleVertexCount;
import com.stuba.mathtrainerapi.entity.PossibleEdgeCount;
import com.stuba.mathtrainerapi.entity.GraphPropertyEntity;
import com.stuba.mathtrainerapi.enums.GraphProperty;
import com.stuba.mathtrainerapi.repository.PracticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PracticeRepository practiceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Practice 1
        Practice practice1 = new Practice();
        practice1.setTitle("Aciklické grafy");

        PracticeContent content1 = new PracticeContent();
        content1.setContentType("Exercise");
        content1.setTitle("Vytvorte acyklický graf");
        content1.setData("Vašou úlohou je vytvoriť acyklický graf s najmenej 5 vrcholmi");
        content1.setMediaLink("-");
        content1.setPractice(practice1);

        PossibleVertexCount pvc1 = new PossibleVertexCount();
        pvc1.setCount(5);
        pvc1.setPracticeContent(content1);

        PossibleVertexCount pvc2 = new PossibleVertexCount();
        pvc2.setCount(6);
        pvc2.setPracticeContent(content1);

        PossibleVertexCount pvc3 = new PossibleVertexCount();
        pvc3.setCount(7);
        pvc3.setPracticeContent(content1);

        PossibleVertexCount pvc4 = new PossibleVertexCount();
        pvc4.setCount(8);
        pvc4.setPracticeContent(content1);

        PossibleEdgeCount pec1 = new PossibleEdgeCount();
        pec1.setCount(1);
        pec1.setPracticeContent(content1);

        PossibleEdgeCount pec2 = new PossibleEdgeCount();
        pec2.setCount(2);
        pec2.setPracticeContent(content1);

        PossibleEdgeCount pec3 = new PossibleEdgeCount();
        pec3.setCount(3);
        pec3.setPracticeContent(content1);

        PossibleEdgeCount pec4 = new PossibleEdgeCount();
        pec4.setCount(4);
        pec4.setPracticeContent(content1);

        PossibleEdgeCount pec5 = new PossibleEdgeCount();
        pec5.setCount(5);
        pec5.setPracticeContent(content1);

        GraphPropertyEntity gpe1 = new GraphPropertyEntity();
        gpe1.setProperty(GraphProperty.ACYCLIC);
        gpe1.setPracticeContent(content1);

        content1.setPossibleVertices(Arrays.asList(pvc1, pvc2, pvc3, pvc4));
        content1.setPossibleEdges(Arrays.asList(pec1, pec2, pec3, pec4, pec5));
        content1.setGraphProperties(Arrays.asList(gpe1));

        practice1.setPracticeContents(Arrays.asList(content1));

        // Practice 2
        Practice practice2 = new Practice();
        practice2.setTitle("Súvislé grafy");

        PracticeContent content2 = new PracticeContent();
        content2.setContentType("Exercise");
        content2.setTitle("Vytvorte súvislý graf");
        content2.setData("Vašou úlohou je vytvoriť súvislý graf s 10 vrcholmi");
        content2.setMediaLink("-");
        content2.setPractice(practice2);

        PossibleVertexCount pvc5 = new PossibleVertexCount();
        pvc5.setCount(10);
        pvc5.setPracticeContent(content2);

        PossibleEdgeCount pec6 = new PossibleEdgeCount();
        pec6.setCount(9);
        pec6.setPracticeContent(content2);

        PossibleEdgeCount pec7 = new PossibleEdgeCount();
        pec7.setCount(10);
        pec7.setPracticeContent(content2);

        PossibleEdgeCount pec8 = new PossibleEdgeCount();
        pec8.setCount(11);
        pec8.setPracticeContent(content2);

        PossibleEdgeCount pec9 = new PossibleEdgeCount();
        pec9.setCount(12);
        pec9.setPracticeContent(content2);

        PossibleEdgeCount pec10 = new PossibleEdgeCount();
        pec10.setCount(13);
        pec10.setPracticeContent(content2);

        PossibleEdgeCount pec11 = new PossibleEdgeCount();
        pec11.setCount(14);
        pec11.setPracticeContent(content2);

        GraphPropertyEntity gpe2 = new GraphPropertyEntity();
        gpe2.setProperty(GraphProperty.CONNECTED);
        gpe2.setPracticeContent(content2);

        content2.setPossibleVertices(Arrays.asList(pvc5));
        content2.setPossibleEdges(Arrays.asList(pec6, pec7, pec8, pec9, pec10, pec11));
        content2.setGraphProperties(Arrays.asList(gpe2));

        practice2.setPracticeContents(Arrays.asList(content2));

        // Practice 3
        Practice practice3 = new Practice();
        practice3.setTitle("Stromové grafy");

        PracticeContent content3 = new PracticeContent();
        content3.setContentType("Exercise");
        content3.setTitle("Vytvorte stromový graf");
        content3.setData("Vašou úlohou je vytvoriť stromový graf s 4 vrcholmi");
        content3.setMediaLink("-");
        content3.setPractice(practice3);

        PossibleVertexCount pvc6 = new PossibleVertexCount();
        pvc6.setCount(4);
        pvc6.setPracticeContent(content3);

        PossibleEdgeCount pec12 = new PossibleEdgeCount();
        pec12.setCount(3);
        pec12.setPracticeContent(content3);

        GraphPropertyEntity gpe3 = new GraphPropertyEntity();
        gpe3.setProperty(GraphProperty.TREE);
        gpe3.setPracticeContent(content3);

        content3.setPossibleVertices(Arrays.asList(pvc6));
        content3.setPossibleEdges(Arrays.asList(pec12));
        content3.setGraphProperties(Arrays.asList(gpe3));

        practice3.setPracticeContents(Arrays.asList(content3));

        // Practice 4
        Practice practice4 = new Practice();
        practice4.setTitle("Aciklické grafy");

        PracticeContent content4 = new PracticeContent();
        content4.setContentType("Exercise");
        content4.setTitle("Vytvorte acyklický graf");
        content4.setData("Vašou úlohou je vytvoriť acyklický graf");
        content4.setMediaLink("-");
        content4.setPractice(practice4);

        PossibleVertexCount pvc7 = new PossibleVertexCount();
        pvc7.setCount(3);
        pvc7.setPracticeContent(content4);

        PossibleVertexCount pvc8 = new PossibleVertexCount();
        pvc8.setCount(4);
        pvc8.setPracticeContent(content4);

        PossibleVertexCount pvc9 = new PossibleVertexCount();
        pvc9.setCount(5);
        pvc9.setPracticeContent(content4);

        PossibleVertexCount pvc10 = new PossibleVertexCount();
        pvc10.setCount(6);
        pvc10.setPracticeContent(content4);

        PossibleEdgeCount pec13 = new PossibleEdgeCount();
        pec13.setCount(2);
        pec13.setPracticeContent(content4);

        PossibleEdgeCount pec14 = new PossibleEdgeCount();
        pec14.setCount(3);
        pec14.setPracticeContent(content4);

        PossibleEdgeCount pec15 = new PossibleEdgeCount();
        pec15.setCount(4);
        pec15.setPracticeContent(content4);

        PossibleEdgeCount pec16 = new PossibleEdgeCount();
        pec16.setCount(5);
        pec16.setPracticeContent(content4);

        GraphPropertyEntity gpe4 = new GraphPropertyEntity();
        gpe4.setProperty(GraphProperty.ACYCLIC);
        gpe4.setPracticeContent(content4);

        content4.setPossibleVertices(Arrays.asList(pvc7, pvc8, pvc9, pvc10));
        content4.setPossibleEdges(Arrays.asList(pec13, pec14, pec15, pec16));
        content4.setGraphProperties(Arrays.asList(gpe4));

        practice4.setPracticeContents(Arrays.asList(content4));

        // Save all practices
        practiceRepository.saveAll(Arrays.asList(practice1, practice2, practice3, practice4));
    }
}


